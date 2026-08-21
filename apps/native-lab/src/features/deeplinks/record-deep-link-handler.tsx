import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';

import { useRecords } from '@/features/records/record-context';

const APP_SCHEME = 'nativelab';

export function RecordDeepLinkHandler() {
  const router = useRouter();
  const url = Linking.useURL();
  const lastHandledUrl = useRef<string | null>(null);
  const { getRecord, isLoading } = useRecords();

  useEffect(() => {
    if (!url || isLoading || url === lastHandledUrl.current) {
      return;
    }

    lastHandledUrl.current = url;
    const recordId = parseRecordId(url);

    if (!recordId) {
      Alert.alert('링크를 열 수 없습니다', '지원하지 않는 Native Lab 링크입니다.', [
        { text: '확인', onPress: () => router.replace('/') },
      ]);
      return;
    }

    if (!getRecord(recordId)) {
      Alert.alert('기록을 찾을 수 없습니다', '삭제되었거나 존재하지 않는 기록입니다.', [
        { text: '목록으로', onPress: () => router.replace('/') },
      ]);
      return;
    }

    router.replace({ pathname: '/record/[id]', params: { id: recordId } });
  }, [getRecord, isLoading, router, url]);

  return null;
}

function parseRecordId(url: string) {
  const parsed = Linking.parse(url);

  if (parsed.scheme !== APP_SCHEME) {
    return null;
  }

  const pathSegments = [parsed.hostname, ...(parsed.path?.split('/') || [])].filter(
    (segment): segment is string => Boolean(segment)
  );

  if (pathSegments.length !== 2 || pathSegments[0] !== 'record') {
    return null;
  }

  let recordId: string;

  try {
    recordId = decodeURIComponent(pathSegments[1]);
  } catch {
    return null;
  }

  return /^[a-z0-9-]+$/i.test(recordId) ? recordId : null;
}
