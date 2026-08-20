import { Stack } from 'expo-router';

import { RecordProvider } from '@/features/records/record-context';

export default function RootLayout() {
  return (
    <RecordProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </RecordProvider>
  );
}
