import * as Sharing from 'expo-sharing';
import { File } from 'expo-file-system';
import { Platform } from 'react-native';

import type { StoredAttachment } from '@/features/attachments/types';

export type ShareAttachmentResult =
  | { shared: true }
  | { failure: { kind: 'unavailable' | 'missing' | 'failed'; message: string } };

export async function shareAttachment(
  attachment: StoredAttachment
): Promise<ShareAttachmentResult> {
  let fileExists = false;

  try {
    fileExists = new File(attachment.uri).info().exists;
  } catch {
    fileExists = false;
  }

  if (!fileExists) {
    return {
      failure: {
        kind: 'missing',
        message: '공유할 파일이 앱 저장 공간에 없습니다. 원본 파일을 다시 첨부해 주세요.',
      },
    };
  }

  try {
    if (!(await Sharing.isAvailableAsync())) {
      return {
        failure: {
          kind: 'unavailable',
          message: '이 기기에서는 파일 공유를 사용할 수 없습니다.',
        },
      };
    }

    await Sharing.shareAsync(attachment.uri, getSharingOptions(attachment));
    return { shared: true };
  } catch {
    return {
      failure: {
        kind: 'failed',
        message: '공유 시트를 열지 못했습니다. 잠시 후 다시 시도해 주세요.',
      },
    };
  }
}

function getSharingOptions(attachment: StoredAttachment) {
  if (Platform.OS === 'android') {
    return {
      dialogTitle: `${attachment.name} 공유`,
      mimeType: attachment.mimeType || 'application/octet-stream',
    };
  }

  return {
    UTI: utiForAttachment(attachment),
  };
}

function utiForAttachment(attachment: StoredAttachment) {
  switch (attachment.mimeType) {
    case 'image/jpeg':
      return 'public.jpeg';
    case 'image/png':
      return 'public.png';
    case 'image/heic':
      return 'public.heic';
    case 'application/pdf':
      return 'com.adobe.pdf';
    case 'text/plain':
      return 'public.plain-text';
    default:
      return attachment.kind === 'image' ? 'public.image' : 'public.data';
  }
}
