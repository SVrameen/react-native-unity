import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  UnityWebGLContent,
  UnityInstance,
  UnityWebViewRef
} from './types';

interface UnityViewProps {
  unityContent: UnityWebGLContent;
  style?: any; // Using any for React Native Web compatibility
  onUnityMessage?: (message: string) => void;
  onPlayerUnload?: (message: string) => void;
  onPlayerQuit?: (message: string) => void;
  fullScreen?: boolean;
}

// This declares the Unity global object that will be available after Unity loads
declare global {
  interface Window {
    createUnityInstance: (
      canvas: HTMLCanvasElement,
      config: UnityContentProps,
      onProgress?: (progress: number) => void
    ) => Promise<WebGLBuilder>;
    unityInstance?: WebGLBuilder;
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

const UnityViewWeb = forwardRef<UnityWebViewRef, UnityViewProps>(
  ({ unityContent, style, onUnityMessage, onPlayerUnload, onPlayerQuit, fullScreen }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<View | null>(null);
    const unityInstanceRef = useRef<WebGLBuilder | null>(null);

    // Setup Unity message handler
    useEffect(() => {
      // Create global event listener for Unity to React Native communication
      window.addEventListener('message', handleUnityMessage);
      window.ReactNativeUnityPostMessage = handleUnityMessage;

      return () => {
        window.removeEventListener('message', handleUnityMessage);
        delete window.ReactNativeUnityPostMessage;
      };
    }, [onUnityMessage]);

    const handleUnityMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && onUnityMessage) {
        onUnityMessage(event.data);
      }
    };

    // Setup Unity instance
    useEffect(() => {
      if (!canvasRef.current || !unityContent.loaderUrl) {
        return;
      }

      const loadUnity = async () => {
        try {
          // Load and instantiate Unity
          window.unityInstance = await window.createUnityInstance(
            canvasRef.current as HTMLCanvasElement,
            unityContent,
            (progress: number) => {
              console.log(`Loading Unity: ${Math.round(progress * 100)}%`);
            }
          );

          unityInstanceRef.current = window.unityInstance;

          // Set fullscreen if needed
          if (fullScreen && unityInstanceRef.current) {
            unityInstanceRef.current.SetFullscreen(true);
          }
        } catch (error) {
          console.error('Failed to load Unity WebGL:', error);
        }
      };

      // Load the Unity loader script
      const script = document.createElement('script');
      script.src = unityContent.loaderUrl;
      script.async = true;
      script.onload = () => {
        loadUnity();
      };
      document.body.appendChild(script);

      // Cleanup function
      return () => {
        if (unityInstanceRef.current) {
          unityInstanceRef.current.Quit();
          unityInstanceRef.current = null;
          window.unityInstance = undefined;

          if (onPlayerUnload) {
            onPlayerUnload('Unity WebGL player unloaded');
          }
        }

        document.body.removeChild(script);
      };
    }, [unityContent.loaderUrl]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      postMessage: (gameObject: string, methodName: string, message: string) => {
        if (unityInstanceRef.current) {
          unityInstanceRef.current.SendMessage(gameObject, methodName, message);
        }
      },
      unloadUnity: () => {
        if (unityInstanceRef.current) {
          unityInstanceRef.current.Quit();
          unityInstanceRef.current = null;
          window.unityInstance = undefined;

          if (onPlayerUnload) {
            onPlayerUnload('Unity WebGL player unloaded');
          }
        }
      },
      pauseUnity: (pause: boolean) => {
        // WebGL builds don't have direct pause/resume, but we can use Time.timeScale
        if (unityInstanceRef.current) {
          const timeScale = pause ? 0 : 1;
          unityInstanceRef.current.SendMessage('WebGLHandler', 'SetTimeScale', timeScale.toString());
        }
      },
      resumeUnity: () => {
        if (unityInstanceRef.current) {
          unityInstanceRef.current.SendMessage('WebGLHandler', 'SetTimeScale', '1');
        }
      }
    }));

    return (
      <View
        ref={containerRef}
        style={[styles.container, style]}
      >
        <canvas
          ref={canvasRef}
          style={styles.canvas}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
});

export default UnityViewWeb;
