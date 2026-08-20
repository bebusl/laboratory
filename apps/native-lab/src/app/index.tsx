import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRecords } from '@/features/records/record-context';

export default function HomeScreen() {
  const router = useRouter();
  const { records } = useRecords();

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={records}
        keyExtractor={record => record.id}
        ListEmptyComponent={<EmptyState onCreate={() => router.push('/record/new')} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>NATIVE LAB</Text>
            <Text style={styles.title}>현장 기록</Text>
            <Text style={styles.description}>
              사진, 파일, 메모를 기기에 남기는 React Native 학습 앱입니다.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.title} 기록 상세 보기`}
            onPress={() => router.push({ pathname: '/record/[id]', params: { id: item.id } })}
            style={({ pressed }) => [styles.recordCard, pressed && styles.pressed]}
          >
            <Text style={styles.recordTitle}>{item.title}</Text>
            <Text numberOfLines={2} style={styles.recordMemo}>
              {item.memo || '메모 없음'}
            </Text>
            <Text style={styles.recordDate}>{formatDate(item.createdAt)}</Text>
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>아직 기록이 없습니다</Text>
      <Text style={styles.emptyDescription}>제목과 메모를 남겨 첫 현장 기록을 만들어 보세요.</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="새 기록 만들기"
        onPress={onCreate}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonLabel}>새 기록 만들기</Text>
      </Pressable>
    </View>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7f9',
  },
  listContent: {
    flexGrow: 1,
    padding: 24,
    gap: 12,
  },
  header: {
    marginBottom: 20,
    gap: 8,
  },
  eyebrow: {
    color: '#637083',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: '#17202d',
    fontSize: 36,
    fontWeight: '700',
  },
  description: {
    color: '#637083',
    fontSize: 16,
    lineHeight: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: {
    color: '#17202d',
    fontSize: 20,
    fontWeight: '600',
  },
  emptyDescription: {
    color: '#637083',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#1769e0',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  recordCard: {
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 8,
    shadowColor: '#17202d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  recordTitle: {
    color: '#17202d',
    fontSize: 17,
    fontWeight: '700',
  },
  recordMemo: {
    color: '#637083',
    fontSize: 14,
    lineHeight: 21,
  },
  recordDate: {
    color: '#8b96a5',
    fontSize: 12,
  },
  pressed: {
    opacity: 0.72,
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
