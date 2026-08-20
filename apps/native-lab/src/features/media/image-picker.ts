import * as ImagePicker from 'expo-image-picker';

import { extensionFromName } from '@/features/attachments/file-storage';
import type { AttachmentSource } from '@/features/attachments/types';

export interface SelectedImage {
  uri: string;
  name: string;
  mimeType: string | null;
  size: number | null;
  width: number;
  height: number;
  source: 'camera' | 'library';
}

export function toAttachmentSource(image: SelectedImage): AttachmentSource {
  return {
    extension: extensionFromName(image.name),
    kind: 'image',
    mimeType: image.mimeType,
    name: image.name,
    size: image.size,
    uri: image.uri,
  };
}

export type ImagePickerFailure =
  | { kind: 'permission-denied'; message: string }
  | { kind: 'error'; message: string };

export async function captureImage(): Promise<
  { image: SelectedImage } | { canceled: true } | { failure: ImagePickerFailure }
> {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return {
        failure: {
          kind: 'permission-denied',
          message: permission.canAskAgain
            ? '카메라 권한을 허용해야 사진을 촬영할 수 있습니다.'
            : '카메라 권한이 거부되었습니다. 기기 설정에서 권한을 허용해 주세요.',
        },
      };
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      mediaTypes: ['images'],
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) {
      return { canceled: true };
    }

    return { image: normalizeImage(result.assets[0], 'camera') };
  } catch {
    return { failure: { kind: 'error', message: '카메라를 실행하지 못했습니다.' } };
  }
}

export async function pickImageFromLibrary(): Promise<
  { image: SelectedImage } | { canceled: true } | { failure: ImagePickerFailure }
> {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return {
        failure: {
          kind: 'permission-denied',
          message:
            permission.accessPrivileges === 'limited'
              ? '선택된 사진에만 접근할 수 있습니다. 다른 사진을 추가하려면 사진 접근 권한을 변경해 주세요.'
              : permission.canAskAgain
                ? '사진 보관함 접근 권한을 허용해야 사진을 선택할 수 있습니다.'
                : '사진 보관함 권한이 거부되었습니다. 기기 설정에서 권한을 허용해 주세요.',
        },
      };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      mediaTypes: ['images'],
      quality: 1,
    });

    if (result.canceled || !result.assets[0]) {
      return { canceled: true };
    }

    return { image: normalizeImage(result.assets[0], 'library') };
  } catch {
    return { failure: { kind: 'error', message: '사진 보관함을 열지 못했습니다.' } };
  }
}

function normalizeImage(
  asset: ImagePicker.ImagePickerAsset,
  source: SelectedImage['source']
): SelectedImage {
  return {
    uri: asset.uri,
    name: asset.fileName || nameFromUri(asset.uri),
    mimeType: asset.mimeType || null,
    size: asset.fileSize ?? null,
    width: asset.width,
    height: asset.height,
    source,
  };
}

function nameFromUri(uri: string) {
  const lastSegment = uri.split('/').pop();
  return lastSegment && lastSegment.includes('.') ? lastSegment : 'photo.jpg';
}
