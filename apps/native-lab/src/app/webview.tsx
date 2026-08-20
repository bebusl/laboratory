import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LEARNING_WEBVIEW_HTML } from '@/features/webview/learning-html';
import { createWebViewMessageScript, parseWebViewMessage } from '@/features/webview/bridge';
import { useRecords } from '@/features/records/record-context';

const ALLOWED_HOSTS = new Set(['docs.expo.dev', 'reactnative.dev']);

export default function WebViewLearningScreen() {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const { records } = useRecords();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bridgeStatus, setBridgeStatus] = useState('웹 준비 메시지를 기다리는 중입니다.');

  const sendRecordCount = () => {
    webViewRef.current?.injectJavaScript(
      createWebViewMessageScript({ type: 'record_count', payload: { count: records.length } })
    );
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const message = parseWebViewMessage(event.nativeEvent.data);

    if (!message) {
      setBridgeStatus('알 수 없는 웹 메시지를 안전하게 무시했습니다.');
      return;
    }

    if (message.type === 'web_ready') {
      setBridgeStatus(`웹 준비 완료 · Bridge v${message.payload.version}`);
      sendRecordCount();
      return;
    }

    if (message.type === 'request_record_count') {
      setBridgeStatus('웹의 기록 개수 요청을 처리했습니다.');
      sendRecordCount();
    }
  };

  const handleWebViewError = () => {
    setIsLoading(false);
    setError('WebView 콘텐츠를 불러오지 못했습니다. 다시 시도해 주세요.');
  };

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.title}>WebView를 열 수 없습니다</Text>
          <Text style={styles.description}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="WebView 다시 시도"
            onPress={() => {
              setError(null);
              setIsLoading(true);
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryLabel}>다시 시도</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="기록 목록으로 돌아가기"
            onPress={() => router.back()}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryLabel}>목록으로</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="기록 목록으로 돌아가기"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backLabel}>‹ 목록</Text>
          </Pressable>
          <Text style={styles.title}>보조 WebView</Text>
          <Text style={styles.status}>{bridgeStatus}</Text>
        </View>
        <View style={styles.webViewContainer}>
          {isLoading ? <Text style={styles.loading}>WebView 로딩 중…</Text> : null}
          <WebView
            javaScriptEnabled
            onError={handleWebViewError}
            onLoadEnd={() => setIsLoading(false)}
            onLoadStart={() => setIsLoading(true)}
            onMessage={handleMessage}
            onShouldStartLoadWithRequest={request => {
              if (request.url === 'about:blank') {
                return true;
              }

              try {
                const parsed = Linking.parse(request.url);
                return (
                  parsed.scheme === 'https' &&
                  Boolean(parsed.hostname && ALLOWED_HOSTS.has(parsed.hostname))
                );
              } catch {
                return false;
              }
            }}
            originWhitelist={['about:blank', 'https://docs.expo.dev', 'https://reactnative.dev']}
            ref={webViewRef}
            source={{ html: LEARNING_WEBVIEW_HTML }}
            style={styles.webView}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6f7f9' },
  container: { flex: 1, padding: 24, gap: 16 },
  header: { gap: 8 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 4 },
  backLabel: { color: '#1769e0', fontSize: 15, fontWeight: '600' },
  title: { color: '#17202d', fontSize: 28, fontWeight: '700' },
  status: { color: '#637083', fontSize: 13, lineHeight: 19 },
  webViewContainer: { flex: 1, overflow: 'hidden', borderRadius: 16, backgroundColor: '#ffffff' },
  webView: { flex: 1, backgroundColor: '#f6f7f9' },
  loading: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    paddingTop: 16,
    color: '#637083',
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  description: { color: '#637083', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  primaryButton: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#1769e0',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  primaryLabel: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b8c4d2',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  secondaryLabel: { color: '#1769e0', fontSize: 15, fontWeight: '700' },
});
