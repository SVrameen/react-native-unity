import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';
import UnityView from '@azesmway/react-native-unity';

// Demo WebGL content (replace with actual paths in real usage)
const DEMO_WEBGL_CONTENT = {
  loaderUrl: 'https://example.com/unity/WebGL.loader.js',
  dataUrl: 'https://example.com/unity/WebGL.data',
  frameworkUrl: 'https://example.com/unity/WebGL.framework.js',
  codeUrl: 'https://example.com/unity/WebGL.wasm',
  streamingAssetsUrl: 'https://example.com/unity/StreamingAssets',
};

export default function WebDemo() {
  const unityRef = useRef<any>(null);
  const [message, setMessage] = useState<string>('No messages yet');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);

  // Handle messages from Unity
  const handleUnityMessage = (event: any) => {
    const msg = event.nativeEvent.message;
    setMessage(msg);
    console.log('Message from Unity:', msg);

    // Check for loading complete message
    if (msg.includes('Unity WebGL loaded')) {
      setIsLoading(false);
    }
  };

  // Handle Unity loading progress (web only)
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleLoadProgress = (progress: number) => {
        setLoadProgress(progress * 100);
      };

      // Add global handler for Unity progress (simplified for demo)
      (window as any).unityProgressCallback = handleLoadProgress;

      return () => {
        delete (window as any).unityProgressCallback;
      };
    }
  }, []);

  // Send a message to Unity
  const sendMessage = () => {
    if (unityRef.current) {
      unityRef.current.postMessage('WebGLHandler', 'HandleMessage', 'Hello from React Native!');
    }
  };

  // Rotate cube example
  const rotateCube = () => {
    if (unityRef.current) {
      unityRef.current.postMessage('WebGLHandler', 'RotateCube', '45');
    }
  };

  // Change color example
  const changeColor = () => {
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    if (unityRef.current) {
      unityRef.current.postMessage('WebGLHandler', 'ChangeColor', randomColor);
    }
  };

  return (
    <View style={styles.container}>
      {/* Status area */}
      <View style={styles.statusArea}>
        <Text style={styles.title}>Unity WebGL Demo</Text>
        {Platform.OS === 'web' && isLoading ? (
          <Text style={styles.loadingText}>
            Loading Unity WebGL: {Math.round(loadProgress)}%
          </Text>
        ) : null}
        <Text style={styles.messageText}>Last message: {message}</Text>
      </View>

      {/* Unity view */}
      <View style={styles.unityContainer}>
        <UnityView
          ref={unityRef}
          style={styles.unity}
          webGLContent={Platform.OS === 'web' ? DEMO_WEBGL_CONTENT : undefined}
          onUnityMessage={handleUnityMessage}
        />
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Button title="Send Message" onPress={sendMessage} />
        <Button title="Rotate Cube" onPress={rotateCube} />
        <Button title="Change Color" onPress={changeColor} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statusArea: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingText: {
    color: 'blue',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 14,
  },
  unityContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  unity: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDDDDD',
  },
});
