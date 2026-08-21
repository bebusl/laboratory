import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { migrateDbIfNeeded } from '@/database/records';
import { RecordProvider } from '@/features/records/record-context';

export default function RootLayout() {
  const [databaseError, setDatabaseError] = useState<Error | null>(null);
  const [databaseAttempt, setDatabaseAttempt] = useState(0);
  const handleDatabaseError = useCallback((error: Error) => {
    console.error('Native Lab SQLite error', error);
    setDatabaseError(error);
  }, []);

  if (databaseError) {
    return (
      <DatabaseErrorScreen
        onRetry={() => {
          setDatabaseError(null);
          setDatabaseAttempt(current => current + 1);
        }}
      />
    );
  }

  return (
    <SQLiteProvider
      key={databaseAttempt}
      databaseName="native-lab.db"
      onError={handleDatabaseError}
      onInit={migrateDbIfNeeded}
    >
      <RecordProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </RecordProvider>
    </SQLiteProvider>
  );
}

function DatabaseErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centered}>
        <Text style={styles.title}>기록 저장소를 열 수 없습니다</Text>
        <Text style={styles.description}>
          데이터베이스를 초기화하지 못했습니다. 다시 시도해 주세요.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="기록 저장소 다시 시도"
          onPress={onRetry}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>다시 시도</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f9' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { color: '#17202d', fontSize: 22, fontWeight: '700', textAlign: 'center' },
  description: { color: '#637083', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  button: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#1769e0',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  buttonLabel: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
});
