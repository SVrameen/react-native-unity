import { Platform } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

// Only import native modules on native platforms
let codegenNativeComponent: any;
let codegenNativeCommands: any;

// Skip importing native-only modules on web
if (Platform.OS !== 'web') {
  codegenNativeComponent =
    require('react-native/Libraries/Utilities/codegenNativeComponent').default;
  codegenNativeCommands =
    require('react-native/Libraries/Utilities/codegenNativeCommands').default;
}

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
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    gameObject: string,
    methodName: string,
    message: string
  ) => void;
  unloadUnity: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
  pauseUnity: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    pause: boolean
  ) => void;
  resumeUnity: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
  windowFocusChanged: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    hasFocus: boolean
  ) => void;
}

// Create mock commands for web platform
export const Commands: NativeCommands =
  Platform.OS !== 'web'
    ? codegenNativeCommands({
        supportedCommands: [
          'postMessage',
          'unloadUnity',
          'pauseUnity',
          'resumeUnity',
          'windowFocusChanged',
        ],
      })
    : {
        // Mock implementations for web
        postMessage: () => {},
        unloadUnity: () => {},
        pauseUnity: () => {},
        resumeUnity: () => {},
        windowFocusChanged: () => {},
      };

// Mock component for web, real native component for iOS/Android
const NativeComponent =
  Platform.OS !== 'web' ? codegenNativeComponent('RNUnityView') : 'RNUnityView'; // Use a string for web

export default NativeComponent as unknown as HostComponent<NativeProps>;
