import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { File } from 'expo-file-system';

import type { StoredAttachment } from '@/features/attachments/types';

interface AttachmentCardProps {
  attachment: StoredAttachment;
  onRemove?: () => void;
  onShare?: () => void;
  isSharing?: boolean;
}

export function AttachmentCard({ attachment, isSharing, onRemove, onShare }: AttachmentCardProps) {
  const isAvailable = getAvailability(attachment.uri);

  return (
    <View style={styles.card}>
      <View style={styles.previewContainer}>
        {attachment.kind === 'image' && isAvailable ? (
          <Image
            accessibilityLabel={`${attachment.name} 미리보기`}
            source={{ uri: attachment.uri }}
            style={styles.preview}
          />
        ) : (
          <View
            accessible
            accessibilityLabel={`${attachment.kind === 'image' ? '이미지' : '문서'} 파일`}
            style={styles.fileBadge}
          >
            <Text style={styles.fileBadgeLabel}>
              {attachment.kind === 'image' ? 'IMG' : 'FILE'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {attachment.name}
        </Text>
        <Text style={styles.metadata}>
          {attachment.kind === 'image' ? '이미지' : '문서'} ·{' '}
          {attachment.mimeType || 'MIME type 없음'} · {formatSize(attachment.size)} ·{' '}
          {attachment.extension || '확장자 없음'}
        </Text>
        <Text numberOfLines={2} style={styles.uri}>
          {attachment.uri}
        </Text>
        {!isAvailable ? (
          <Text style={styles.missing}>파일이 사라졌습니다. 원본을 다시 첨부해 주세요.</Text>
        ) : null}
        {onShare || onRemove ? (
          <View style={styles.actions}>
            {onShare ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${attachment.name} 공유`}
                disabled={isSharing}
                onPress={onShare}
                style={styles.actionButton}
              >
                <Text style={styles.actionLabel}>{isSharing ? '공유 중…' : '공유'}</Text>
              </Pressable>
            ) : null}
            {onRemove ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${attachment.name} 첨부파일 제거`}
                onPress={onRemove}
                style={styles.removeButton}
              >
                <Text style={styles.removeLabel}>첨부파일 제거</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

function getAvailability(uri: string) {
  try {
    return new File(uri).info().exists;
  } catch {
    return false;
  }
}

function formatSize(size: number | null) {
  if (size === null) return '크기 확인 전';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  previewContainer: { width: 72, height: 72 },
  preview: { width: 72, height: 72, borderRadius: 8, backgroundColor: '#e9eef5' },
  fileBadge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#e9eef5',
  },
  fileBadgeLabel: { color: '#1769e0', fontSize: 12, fontWeight: '800' },
  info: { flex: 1, justifyContent: 'center', gap: 4 },
  name: { color: '#17202d', fontSize: 14, fontWeight: '600' },
  metadata: { color: '#637083', fontSize: 11, lineHeight: 16 },
  uri: { color: '#8b96a5', fontSize: 10, lineHeight: 14 },
  missing: { color: '#b42318', fontSize: 12, lineHeight: 17 },
  removeButton: { alignSelf: 'flex-start', paddingVertical: 3 },
  removeLabel: { color: '#b42318', fontSize: 12, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionButton: { alignSelf: 'flex-start', paddingVertical: 3 },
  actionLabel: { color: '#1769e0', fontSize: 12, fontWeight: '700' },
});
