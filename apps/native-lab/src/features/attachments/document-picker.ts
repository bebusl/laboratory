import * as DocumentPicker from 'expo-document-picker';

import {
  AttachmentStorageError,
  extensionFromName,
  storeAttachment,
  type AttachmentStorageFailureKind,
} from '@/features/attachments/file-storage';
import type { StoredAttachment } from '@/features/attachments/types';

export type DocumentPickerFailure =
  | { kind: AttachmentStorageFailureKind; message: string }
  | { kind: 'picker-error'; message: string };

export async function pickAndStoreDocument(): Promise<
  { attachment: StoredAttachment } | { canceled: true } | { failure: DocumentPickerFailure }
> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: '*/*',
    });

    if (result.canceled || !result.assets[0]) {
      return { canceled: true };
    }

    const asset = result.assets[0];
    const attachment = await storeAttachment({
      extension: extensionFromName(asset.name),
      kind: 'document',
      mimeType: asset.mimeType || null,
      name: asset.name,
      size: asset.size ?? null,
      uri: asset.uri,
    });

    return { attachment };
  } catch (cause: unknown) {
    if (isStorageFailure(cause)) {
      return { failure: { kind: cause.kind, message: cause.message } };
    }

    return {
      failure: {
        kind: 'picker-error',
        message: '문서 선택기를 실행하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      },
    };
  }
}

function isStorageFailure(cause: unknown): cause is Error & {
  kind: AttachmentStorageFailureKind;
} {
  return cause instanceof AttachmentStorageError;
}
