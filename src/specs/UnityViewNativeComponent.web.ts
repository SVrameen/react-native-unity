import type { ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

export type UnityViewContentUpdateEvent = Readonly<{
  message: string;
}>;

export interface NativeProps extends ViewProps {
  androidKeepPlayerMounted?: boolean;
  fullScreen?: boolean;
  onUnityMessage?: DirectEventHandler<UnityViewContentUpdateEvent>;
  onPlayerUnload?: DirectEventHandler<UnityViewContentUpdateEvent>;
  onPlayerQuit?: DirectEventHandler<UnityViewContentUpdateEvent>;
}

export interface NativeCommands {
  postMessage: (
    viewRef: any,
    gameObject: string,
    methodName: string,
    message: string
  ) => void;
  unloadUnity: (viewRef: any) => void;
  pauseUnity: (viewRef: any, pause: boolean) => void;
  resumeUnity: (viewRef: any) => void;
  windowFocusChanged: (viewRef: any, hasFocus: boolean) => void;
}

// Mock implementations for web
export const Commands: NativeCommands = {
  postMessage: () => {},
  unloadUnity: () => {},
  pauseUnity: () => {},
  resumeUnity: () => {},
  windowFocusChanged: () => {},
};

// Mock component for web
export default 'div' as any;
