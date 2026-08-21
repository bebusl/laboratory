import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRecords } from '@/features/records/record-context';

export default function RecordDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deleteRecord, error, getRecord, isLoading } = useRecords();
  const [isDeleting, setIsDeleting] = useState(false);
  const record = getRecord(id);

  if (isLoading) {
    return <StatusScreen message="기록을 불러오는 중입니다." />;
  }

  if (error) {
    return <StatusScreen message="기록 저장소를 사용할 수 없습니다." />;
  }

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

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="기록 수정"
          onPress={() => router.push({ pathname: '/record/edit/[id]', params: { id: record.id } })}
          disabled={isDeleting}
          style={[styles.editButton, isDeleting && styles.disabledButton]}
        >
          <Text style={styles.editLabel}>기록 수정</Text>
        </Pressable>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderTitle}>첨부파일</Text>
          <Text style={styles.placeholderDescription}>
            사진과 문서 첨부는 다음 네이티브 기능 학습 단계에서 추가합니다.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="기록 삭제"
          onPress={() => {
            Alert.alert('기록 삭제', '이 기록을 삭제할까요?', [
              { text: '취소', style: 'cancel' },
              {
                text: '삭제',
                style: 'destructive',
                onPress: () => {
                  setIsDeleting(true);
                  void deleteRecord(record.id)
                    .then(() => router.replace('/'))
                    .catch(() => {
                      setIsDeleting(false);
                      Alert.alert('삭제 실패', '기록을 삭제하지 못했습니다.');
                    });
                },
              },
            ]);
          }}
          disabled={isDeleting}
          style={[styles.deleteButton, isDeleting && styles.disabledButton]}
        >
          <Text style={styles.deleteLabel}>기록 삭제</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusScreen({ message }: { message: string }) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centered}>
        <Text style={styles.description}>{message}</Text>
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
  deleteButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e3a3a0',
    paddingVertical: 14,
  },
  deleteLabel: { color: '#b42318', fontSize: 15, fontWeight: '700' },
  disabledButton: { opacity: 0.55 },
  editButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b8c4d2',
    paddingVertical: 14,
  },
  editLabel: { color: '#1769e0', fontSize: 15, fontWeight: '700' },
});
