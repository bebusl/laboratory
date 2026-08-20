export const LEARNING_WEBVIEW_HTML = `<!doctype html>
<html lang="ko">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
      body { margin: 0; padding: 24px; color: #17202d; background: #f6f7f9; }
      main { max-width: 560px; margin: 0 auto; }
      h1 { font-size: 28px; margin: 0 0 8px; }
      p { color: #637083; line-height: 1.5; }
      section { padding: 16px; margin-top: 16px; border-radius: 14px; background: white; }
      button, a { display: block; width: 100%; box-sizing: border-box; margin-top: 10px; padding: 12px; border: 1px solid #b8c4d2; border-radius: 10px; color: #1769e0; background: white; text-align: center; text-decoration: none; font-size: 15px; }
      button { cursor: pointer; }
      #status { color: #1769e0; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <h1>WebView 보조 학습 화면</h1>
      <p>이 화면은 앱의 주 콘텐츠가 아니라 React Native와 웹 메시지 통신을 확인하기 위한 보조 화면입니다.</p>
      <section>
        <strong>Bridge 상태</strong>
        <p id="status">RN 준비 메시지를 기다리는 중입니다.</p>
        <button type="button" onclick="requestRecordCount()">RN에 기록 개수 요청</button>
      </section>
      <section>
        <strong>Navigation allowlist 확인</strong>
        <a href="https://docs.expo.dev/versions/v57.0.0/">허용된 Expo 문서 링크</a>
        <a href="https://example.com/">차단되어야 하는 외부 링크</a>
      </section>
    </main>
    <script>
      function sendToNative(message) {
        window.ReactNativeWebView.postMessage(JSON.stringify(message));
      }

      function requestRecordCount() {
        sendToNative({ type: 'request_record_count', payload: {} });
      }

      window.__nativeLabReceive = function (message) {
        if (message.type === 'record_count') {
          document.getElementById('status').textContent = '현재 저장된 기록: ' + message.payload.count + '개';
        }
        if (message.type === 'native_error') {
          document.getElementById('status').textContent = message.payload.message;
        }
      };

      window.addEventListener('DOMContentLoaded', function () {
        sendToNative({ type: 'web_ready', payload: { version: 1 } });
      });
    </script>
  </body>
</html>`;
