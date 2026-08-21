import { Directory, File, Paths } from 'expo-file-system';

import type { AttachmentSource, StoredAttachment } from '@/features/attachments/types';

const attachmentDirectory = new Directory(Paths.document, 'attachments');

export type AttachmentStorageFailureKind = 'missing-source' | 'copy-failed';

export class AttachmentStorageError extends Error {
  constructor(
    public readonly kind: AttachmentStorageFailureKind,
    message: string
  ) {
    super(message);
    this.name = 'AttachmentStorageError';
  }
}

export async function storeAttachment(source: AttachmentSource): Promise<StoredAttachment> {
  const sourceFile = new File(source.uri);
  let sourceInfo;

  try {
    sourceInfo = sourceFile.info();
  } catch {
    throw new AttachmentStorageError(
      'missing-source',
      '선택한 파일을 읽을 수 없습니다. 파일을 다시 선택해 주세요.'
    );
  }

  if (!sourceInfo.exists) {
    throw new AttachmentStorageError(
      'missing-source',
      '선택한 파일을 읽을 수 없습니다. 파일을 다시 선택해 주세요.'
    );
  }

  let destination: File | null = null;

  try {
    attachmentDirectory.create({ idempotent: true, intermediates: true });

    const safeName = sanitizeFileName(source.name, source.extension);
    destination = new File(attachmentDirectory, `${createStorageId()}-${safeName}`);
    await sourceFile.copy(destination);
    const destinationInfo = destination.info();

    if (!destinationInfo.exists) {
      throw new Error('The copied attachment does not exist');
    }

    return {
      ...source,
      name: source.name || destination.name,
      mimeType: source.mimeType || destination.type || null,
      size: destinationInfo.size ?? source.size,
      extension: source.extension || extensionFromName(source.name),
      uri: destination.uri,
    };
  } catch {
    try {
      if (destination?.info().exists) {
        destination.delete();
      }
    } catch {
      // Keep the original copy failure visible. A later cleanup pass can handle the file.
    }

    throw new AttachmentStorageError(
      'copy-failed',
      '파일을 앱 전용 저장 공간에 보관하지 못했습니다. 저장 공간을 확인하고 다시 시도해 주세요.'
    );
  }
}

export function deleteStoredAttachment(uri: string) {
  const file = new File(uri);

  if (!file.exists) {
    return;
  }

  file.delete();
}

export function extensionFromName(name: string) {
  const lastSegment = name.split(/[\\/]/).pop() || '';
  const dotIndex = lastSegment.lastIndexOf('.');

  if (dotIndex <= 0 || dotIndex === lastSegment.length - 1) {
    return null;
  }

  return lastSegment.slice(dotIndex).toLowerCase();
}

function sanitizeFileName(name: string, extension: string | null) {
  const lastSegment = name.split(/[\\/]/).pop() || 'attachment';
  const sanitized = lastSegment
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}._-]+/gu, '_')
    .replace(/^\.+/, '')
    .slice(0, 120);

  if (sanitized) {
    return sanitized;
  }

  return `attachment${extension || ''}`;
}

function createStorageId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
