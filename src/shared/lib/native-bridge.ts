/**
 * Thin accessor for the bridge the React Native app injects when this page is opened
 * inside its payment WebView. In a plain browser the global is absent and every helper
 * here degrades to a no-op, so pages stay usable on the web.
 */

export type NativeContext = {
  token?: string | null;
  platform?: string;
  embedded?: boolean;
  /** When set, the page skips its form and pays this amount straight away. */
  amount?: number;
  description?: string;
};

type NativeBridge = {
  isAvailable: boolean;
  context: NativeContext;
  post: (action: string, payload?: unknown) => void;
  request: <T = unknown>(action: string, payload?: unknown) => Promise<T>;
  on: (action: string, listener: (payload: unknown) => void) => () => void;
};

declare global {
  interface Window {
    NativeBridge?: NativeBridge;
  }
}

/** Actions the native side listens for — keep in sync with the app's PAYMENT_BRIDGE_ACTIONS. */
export const NATIVE_ACTIONS = {
  ready: 'payment:ready',
  close: 'payment:close',
  toast: 'payment:toast',
  setTitle: 'payment:set-title',
  result: 'payment:result',
} as const;

export const isEmbeddedInApp = (): boolean => Boolean(window.NativeBridge?.isAvailable);

export const nativeContext = (): NativeContext => window.NativeBridge?.context ?? {};

export const postToNative = (action: string, payload?: unknown): void => {
  window.NativeBridge?.post(action, payload);
};
