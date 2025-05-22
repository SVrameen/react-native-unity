import { ViewStyle, StyleProp } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

/**
 * Unity WebGL content properties for web platform
 */
export interface UnityWebGLContent {
  /** URL to the Unity WebGL loader script */
  loaderUrl: string;
  /** URL to the Unity WebGL data file */
  dataUrl: string;
  /** URL to the Unity WebGL framework script */
  frameworkUrl: string;
  /** URL to the Unity WebGL code (wasm) file */
  codeUrl: string;
  /** Optional URL to streaming assets */
  streamingAssetsUrl?: string;
  /** Optional company name */
  companyName?: string;
  /** Optional product name */
  productName?: string;
  /** Optional product version */
  productVersion?: string;
  /** Optional width (for styling) */
  width?: string | number;
  /** Optional height (for styling) */
  height?: string | number;
  /** Optional background color */
  background?: string;
  /** Whether to match WebGL canvas size to the element size */
  matchWebGLToCanvasSize?: boolean;
  /** Optional device pixel ratio */
  devicePixelRatio?: number;
}

/**
 * Helper function to auto-detect WebGL build location
 * Similar to how iOS auto-detects UnityFramework.framework
 */
export function getDefaultWebGLContent(): UnityWebGLContent | undefined {
  try {
    // Default path convention for WebGL builds: /unity/builds/web/
    const defaultWebGLPath = '/unity/builds/web';

    return {
      loaderUrl: `${defaultWebGLPath}/WebGL.loader.js`,
      dataUrl: `${defaultWebGLPath}/WebGL.data`,
      frameworkUrl: `${defaultWebGLPath}/WebGL.framework.js`,
      codeUrl: `${defaultWebGLPath}/WebGL.wasm`,
    };
  } catch (error) {
    // Handle errors silently in case we're in a non-DOM environment
    return undefined;
  }
}

/**
 * Event data for Unity message events
 */
export type UnityViewContentUpdateEvent = Readonly<{
  message: string;
}>;

/**
 * Props for the UnityView component
 */
export interface UnityViewProps {
  /** Android-specific: keep player mounted when component unmounts */
  androidKeepPlayerMounted?: boolean;
  /** Whether to display Unity in fullscreen */
  fullScreen?: boolean;
  /** Called when a message is received from Unity */
  onUnityMessage?: DirectEventHandler<UnityViewContentUpdateEvent>;
  /** Called when the Unity player is unloaded */
  onPlayerUnload?: DirectEventHandler<UnityViewContentUpdateEvent>;
  /** Called when the Unity player quits */
  onPlayerQuit?: DirectEventHandler<UnityViewContentUpdateEvent>;
  /** Custom styles for the Unity view */
  style?: StyleProp<ViewStyle>;
  /** Web-specific: Unity WebGL content properties */
  webGLContent?: UnityWebGLContent;
}

/**
 * Methods available on the UnityViewWeb component reference
 */
export interface UnityWebViewRef {
  /** Send a message to Unity */
  postMessage: (gameObject: string, methodName: string, message: string) => void;
  /** Unload the Unity instance */
  unloadUnity: () => void;
  /** Pause or unpause Unity */
  pauseUnity: (pause: boolean) => void;
  /** Resume Unity */
  resumeUnity: () => void;
}

/**
 * Unity instance methods
 */
export interface UnityInstance {
  /** Send a message to a GameObject in Unity */
  SendMessage: (gameObject: string, methodName: string, message: string) => void;
  /** Quit the Unity instance */
  Quit: () => void;
  /** Set fullscreen mode */
  SetFullscreen: (fullscreen: boolean) => void;
}
