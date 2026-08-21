import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { pickAndStoreDocument } from '@/features/attachments/document-picker';
import { deleteStoredAttachment, storeAttachment } from '@/features/attachments/file-storage';
import { AttachmentCard } from '@/features/attachments/attachment-card';
import type { StoredAttachment } from '@/features/attachments/types';
import {
  captureImage,
  pickImageFromLibrary,
  toAttachmentSource,
} from '@/features/media/image-picker';

interface ImageAttachmentPickerProps {
  value: StoredAttachment[];
  onChange: (attachments: StoredAttachment[]) => void;
}

export function ImageAttachmentPicker({ value, onChange }: ImageAttachmentPickerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const runPicker = async (kind: 'camera' | 'library') => {
    setIsPicking(true);
    setError(null);

    const result = kind === 'camera' ? await captureImage() : await pickImageFromLibrary();

    if ('image' in result) {
      try {
        const attachment = await storeAttachment(toAttachmentSource(result.image));
        onChange([...value, attachment]);
      } catch (cause: unknown) {
        setError(toStorageMessage(cause));
      } finally {
        setIsPicking(false);
      }
      return;
    }

    setIsPicking(false);

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
      onChange([...value, result.attachment]);
      return;
    }

    if ('failure' in result) {
      setError(result.failure.message);
    }
  };

  const removeAttachment = async (attachment: StoredAttachment) => {
    setIsPicking(true);
    setError(null);

    try {
      deleteStoredAttachment(attachment.uri);
      onChange(value.filter(current => current.uri !== attachment.uri));
    } catch {
      setError('첨부파일을 제거하지 못했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsPicking(false);
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
      {value.map(attachment => (
        <AttachmentCard
          attachment={attachment}
          key={attachment.uri}
          onRemove={() => void removeAttachment(attachment)}
        />
      ))}

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

      {error ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {error}
        </Text>
      ) : null}
      <Text style={styles.hint}>
        선택한 파일은 앱 Documents/attachments에 한 번만 복사하며, 원본 메모리를 읽지 않습니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  label: { color: '#17202d', fontSize: 14, fontWeight: '700' },
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
