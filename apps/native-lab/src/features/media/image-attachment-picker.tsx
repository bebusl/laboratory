import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { pickAndStoreDocument } from '@/features/attachments/document-picker';
import { storeAttachment } from '@/features/attachments/file-storage';
import type { StoredAttachment } from '@/features/attachments/types';
import {
  captureImage,
  pickImageFromLibrary,
  toAttachmentSource,
} from '@/features/media/image-picker';

interface ImageAttachmentPickerProps {
  value: StoredAttachment | null;
  onChange: (attachment: StoredAttachment | null) => void;
}

export function ImageAttachmentPicker({ value, onChange }: ImageAttachmentPickerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const runPicker = async (kind: 'camera' | 'library') => {
    setIsPicking(true);
    setError(null);

    const result = kind === 'camera' ? await captureImage() : await pickImageFromLibrary();

    setIsPicking(false);

    if ('image' in result) {
      try {
        onChange(await storeAttachment(toAttachmentSource(result.image)));
      } catch (cause: unknown) {
        setError(toStorageMessage(cause));
      }
      return;
    }

    if ('failure' in result) {
      setError(result.failure.message);
    }
  };

  const runDocumentPicker = async () => {
    setIsPicking(true);
    setError(null);

    const result = await pickAndStoreDocument();

    setIsPicking(false);

    if ('attachment' in result) {
      onChange(result.attachment);
      return;
    }

    if ('failure' in result) {
      setError(result.failure.message);
    }
  };

  const explainPermission = (kind: 'camera' | 'library') => {
    const title = kind === 'camera' ? '카메라 권한' : '사진 접근 권한';
    const message =
      kind === 'camera'
        ? '현장 기록에 사진을 첨부하려면 카메라 접근 권한이 필요합니다.'
        : '현장 기록에 사진을 첨부하려면 사진 보관함 접근 권한이 필요합니다.';

    Alert.alert(title, message, [
      { text: '취소', style: 'cancel' },
      { text: '계속', onPress: () => void runPicker(kind) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>파일 첨부</Text>
      {value ? (
        <View style={styles.previewCard}>
          <Image
            accessibilityLabel={`${value.name} 미리보기`}
            source={{ uri: value.uri }}
            style={styles.preview}
          />
          <View style={styles.previewInfo}>
            <Text numberOfLines={1} style={styles.fileName}>
              {value.name}
            </Text>
            <Text style={styles.metadata}>
              {value.mimeType || 'MIME type 확인 전'} · {formatSize(value.size)} ·{' '}
              {value.uri.startsWith('file://') ? '앱 전용 저장됨' : '저장 위치 확인 전'}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="선택한 첨부파일 제거"
              onPress={() => onChange(null)}
              style={styles.removeButton}
            >
              <Text style={styles.removeLabel}>첨부파일 제거</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="사진 보관함에서 선택"
          disabled={isPicking}
          onPress={() => explainPermission('library')}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <Text style={styles.actionLabel}>사진 보관함</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="카메라로 사진 촬영"
          disabled={isPicking}
          onPress={() => explainPermission('camera')}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <Text style={styles.actionLabel}>카메라 촬영</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="문서 파일 선택"
          disabled={isPicking}
          onPress={() => void runDocumentPicker()}
          style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
        >
          <Text style={styles.actionLabel}>문서 선택</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text style={styles.hint}>
        선택한 파일은 앱 Documents/attachments에 한 번만 복사하며, 원본 메모리를 읽지 않습니다.
      </Text>
    </View>
  );
}

function formatSize(size: number | null) {
  if (size === null) return '크기 확인 전';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  label: { color: '#17202d', fontSize: 14, fontWeight: '700' },
  previewCard: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  preview: { width: 84, height: 84, borderRadius: 8, backgroundColor: '#e9eef5' },
  previewInfo: { flex: 1, justifyContent: 'center', gap: 5 },
  fileName: { color: '#17202d', fontSize: 14, fontWeight: '600' },
  metadata: { color: '#637083', fontSize: 12 },
  removeButton: { alignSelf: 'flex-start', paddingVertical: 3 },
  removeLabel: { color: '#b42318', fontSize: 12, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 10 },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b8c4d2',
    paddingVertical: 12,
  },
  actionLabel: { color: '#1769e0', fontSize: 14, fontWeight: '700' },
  error: { color: '#b42318', fontSize: 13, lineHeight: 19 },
  hint: { color: '#8b96a5', fontSize: 12, lineHeight: 18 },
  pressed: { opacity: 0.72 },
});

function toStorageMessage(cause: unknown) {
  return cause instanceof Error
    ? cause.message
    : '파일을 앱 전용 저장 공간에 보관하지 못했습니다. 다시 시도해 주세요.';
}
