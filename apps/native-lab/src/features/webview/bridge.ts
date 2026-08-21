export type WebViewToNativeMessage =
  | { type: 'web_ready'; payload: { version: number } }
  | { type: 'request_record_count'; payload: Record<string, never> };

export type NativeToWebViewMessage =
  | { type: 'record_count'; payload: { count: number } }
  | { type: 'native_error'; payload: { message: string } };

export function parseWebViewMessage(rawMessage: string): WebViewToNativeMessage | null {
  try {
    const candidate: unknown = JSON.parse(rawMessage);

    if (!isRecord(candidate) || typeof candidate.type !== 'string') {
      return null;
    }

    if (
      candidate.type === 'web_ready' &&
      isRecord(candidate.payload) &&
      typeof candidate.payload.version === 'number'
    ) {
      return {
        payload: { version: candidate.payload.version },
        type: 'web_ready',
      };
    }

    if (candidate.type === 'request_record_count' && isRecord(candidate.payload)) {
      return { payload: {}, type: 'request_record_count' };
    }

    return null;
  } catch {
    return null;
  }
}

export function createWebViewMessageScript(message: NativeToWebViewMessage) {
  const serializedMessage = JSON.stringify(message).replace(/</g, '\\u003c');

  return `window.__nativeLabReceive(${serializedMessage}); true;`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
