import React from 'react';

import NativeUnityView, { Commands } from './specs/UnityViewNativeComponent';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import { Platform } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

// Import WebGL specific implementation and types
import UnityViewWeb from './UnityViewWeb';
import type { UnityWebViewRef, UnityWebGLContent } from './types';
import { getDefaultWebGLContent } from './types';

type UnityViewContentUpdateEvent = Readonly<{
  message: string;
}>;

type RNUnityViewProps = {
  androidKeepPlayerMounted?: boolean;
  fullScreen?: boolean;
  onUnityMessage?: DirectEventHandler<UnityViewContentUpdateEvent>;
  onPlayerUnload?: DirectEventHandler<UnityViewContentUpdateEvent>;
  onPlayerQuit?: DirectEventHandler<UnityViewContentUpdateEvent>;
  style?: StyleProp<ViewStyle>;
  // Web specific props
  webGLContent?: UnityWebGLContent;
};

// Force any type for component ref to handle both native and web
type ComponentRef = any;

export default class UnityView extends React.Component<RNUnityViewProps> {
  ref = React.createRef<any>(); // Using any as we need to handle both native and web refs

  public postMessage = (
    gameObject: string,
    methodName: string,
    message: string
  ) => {
    if (!this.ref.current) return;

    if (Platform.OS === 'web') {
      this.ref.current.postMessage(gameObject, methodName, message);
    } else {
      Commands.postMessage(this.ref.current, gameObject, methodName, message);
    }
  };

  public unloadUnity = () => {
    if (!this.ref.current) return;

    if (Platform.OS === 'web') {
      this.ref.current.unloadUnity();
    } else {
      Commands.unloadUnity(this.ref.current);
    }
  };

  public pauseUnity(pause: boolean) {
    if (!this.ref.current) return;

    if (Platform.OS === 'web') {
      this.ref.current.pauseUnity(pause);
    } else {
      Commands.pauseUnity(this.ref.current, pause);
    }
  }

  public resumeUnity() {
    if (!this.ref.current) return;

    if (Platform.OS === 'web') {
      this.ref.current.resumeUnity();
    } else {
      Commands.resumeUnity(this.ref.current);
    }
  }

  public windowFocusChanged(hasFocus = true) {
    if (Platform.OS !== 'android') return;

    if (this.ref.current) {
      Commands.windowFocusChanged(this.ref.current, hasFocus);
    }
  }

  private getProps() {
    return {
      ...this.props,
    };
  }

  componentWillUnmount() {
    this.unloadUnity();
  }

  render() {
    // For web platform, use the WebGL implementation
    if (Platform.OS === 'web') {
      const { webGLContent, onUnityMessage, onPlayerUnload, onPlayerQuit, fullScreen, style } = this.props;

      // Try to use provided webGLContent or auto-detect it
      const unityContent = webGLContent || getDefaultWebGLContent();

      if (!unityContent) {
        console.warn('UnityView: webGLContent prop is required for web platform or place your WebGL build in /unity/builds/web/');
        return null;
      }

      // Handle event conversion for web
      const handleUnityMessage = (message: string) => {
        onUnityMessage?.({
          nativeEvent: { message },
        });
      };

      const handlePlayerUnload = (message: string) => {
        onPlayerUnload?.({
          nativeEvent: { message },
        });
      };

      const handlePlayerQuit = (message: string) => {
        onPlayerQuit?.({
          nativeEvent: { message },
        });
      };

      return (
        <UnityViewWeb
          ref={this.ref}
          unityContent={unityContent}
          onUnityMessage={handleUnityMessage}
          onPlayerUnload={handlePlayerUnload}
          onPlayerQuit={handlePlayerQuit}
          fullScreen={fullScreen}
          style={style}
        />
      );
    }

    // For native platforms, use the native implementation
    return <NativeUnityView ref={this.ref} {...this.getProps()} />;
  }
}
