import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>NATIVE LAB</Text>
          <Text style={styles.title}>현장 기록</Text>
          <Text style={styles.description}>
            사진, 파일, 메모를 기기에 남기는 React Native 학습 앱입니다.
          </Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>아직 기록이 없습니다</Text>
          <Text style={styles.emptyDescription}>
            다음 단계에서 기록 작성과 네이티브 기능을 연결합니다.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="새 기록 만들기"
            style={styles.button}
          >
            <Text style={styles.buttonLabel}>새 기록 만들기</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f7f9',
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 32,
  },
  header: {
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
  },
  button: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#1769e0',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
