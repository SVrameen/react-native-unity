import UnityView from './UnityView';
import UnityViewWeb from './UnityViewWeb';
import type { UnityWebViewRef, UnityWebGLContent } from './types';
import { getDefaultWebGLContent } from './types';

// Export Unity WebGL types
export type { UnityWebViewRef, UnityWebGLContent };
export { getDefaultWebGLContent };

// Export components
export { UnityViewWeb };
export default UnityView;
