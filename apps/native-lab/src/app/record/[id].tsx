import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRecords } from '@/features/records/record-context';

export default function RecordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRecord } = useRecords();
  const record = getRecord(id);

  if (!record) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>기록을 찾을 수 없습니다</Text>
          <Text style={styles.description}>
            아직 저장되지 않았거나 앱을 다시 시작해 사라진 기록입니다.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="기록 목록으로 돌아가기"
            onPress={() => router.replace('/')}
            style={styles.button}
          >
            <Text style={styles.buttonLabel}>목록으로 돌아가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollView}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="기록 목록으로 돌아가기"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backLabel}>‹ 목록</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>{record.title}</Text>
          <Text style={styles.date}>{formatDate(record.createdAt)}</Text>
        </View>

        <View style={styles.memoCard}>
          <Text style={styles.memoLabel}>메모</Text>
          <Text style={styles.memo}>{record.memo || '작성한 메모가 없습니다.'}</Text>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>첨부파일</Text>
          <Text style={styles.placeholderDescription}>
            사진과 문서 첨부는 다음 네이티브 기능 학습 단계에서 추가합니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f9' },
  scrollView: { flex: 1 },
  container: { padding: 24, gap: 24 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  backLabel: { color: '#1769e0', fontSize: 15, fontWeight: '600' },
  header: { gap: 8 },
  title: { color: '#17202d', fontSize: 30, fontWeight: '700', textAlign: 'center' },
  date: { color: '#8b96a5', fontSize: 13, textAlign: 'center' },
  description: { color: '#637083', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  memoCard: { gap: 10, borderRadius: 16, backgroundColor: '#ffffff', padding: 18 },
  memoLabel: { color: '#637083', fontSize: 13, fontWeight: '700' },
  memo: { color: '#17202d', fontSize: 16, lineHeight: 25 },
  placeholder: { gap: 8, borderRadius: 16, borderWidth: 1, borderColor: '#d9e0e8', padding: 18 },
  placeholderTitle: { color: '#17202d', fontSize: 16, fontWeight: '700' },
  placeholderDescription: { color: '#637083', fontSize: 14, lineHeight: 21 },
  button: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#1769e0',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  buttonLabel: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
