import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';

import { migrateDbIfNeeded } from '@/database/records';
import { RecordProvider } from '@/features/records/record-context';

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="native-lab.db"
      onError={error => console.error('Native Lab SQLite error', error)}
      onInit={migrateDbIfNeeded}
    >
      <RecordProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </RecordProvider>
    </SQLiteProvider>
  );
}
