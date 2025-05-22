// Web implementation entry point
import UnityView from './UnityView';
import type { UnityWebViewRef, UnityWebGLContent } from './types';
import { getDefaultWebGLContent } from './types';

// Export Unity WebGL types
export type { UnityWebViewRef, UnityWebGLContent };
export { getDefaultWebGLContent };

// Export components
export default UnityView;
