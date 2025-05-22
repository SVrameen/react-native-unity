# Web (WebGL) Support

This plugin now supports Unity WebGL builds for web applications, making it compatible with React Native Web or Expo projects.

## Setup Unity for WebGL

1. In your Unity project, add the provided scripts:
   - Add `WebGLHandler.cs` to your Unity project.
   - Create a folder `Plugins/WebGL` and add the `ReactNativeUnityPlugin.jslib` file there.

2. Configure your Unity project for WebGL:
   - Open your Unity project
   - Go to `File > Build Settings`
   - Switch the platform to `WebGL`
   - Click `Build` and select a directory to save the WebGL build

3. Make sure to add a GameObject with the WebGLHandler component to your scene to handle communication with React Native.

4. Copy your WebGL build files to `/unity/builds/web/` directory in your React Native project for auto-detection to work:

```
your-react-native-project/
├── unity/
│   ├── builds/
│   │   ├── ios/          # iOS build (existing)
│   │   ├── android/      # Android build (existing)
│   │   └── web/          # WebGL build (new)
│   │       ├── WebGL.loader.js
│   │       ├── WebGL.framework.js
│   │       ├── WebGL.data
│   │       └── WebGL.wasm
```

## Using WebGL in React Native Web

Import and use the UnityView component in your React Native app:

```tsx
import React from 'react';
import { View } from 'react-native';
import UnityView from '@azesmway/react-native-unity';

export default function App() {
  // Option 1: Auto-detection - Place your WebGL build in /unity/builds/web/ directory
  // No need to specify webGLContent prop, it will be auto-detected

  // Option 2: Manual configuration - Specify the paths to your Unity WebGL build files
  const webGLContent = {
    loaderUrl: 'YOUR_UNITY_BUILD/WebGL.loader.js',
    dataUrl: 'YOUR_UNITY_BUILD/WebGL.data',
    frameworkUrl: 'YOUR_UNITY_BUILD/WebGL.framework.js',
    codeUrl: 'YOUR_UNITY_BUILD/WebGL.wasm',
    // Optional
    streamingAssetsUrl: 'YOUR_UNITY_BUILD/StreamingAssets',
    companyName: 'YourCompany',
    productName: 'YourProduct',
    productVersion: '1.0.0',
  };

  const unityRef = React.useRef(null);

  const handleUnityMessage = (event) => {
    console.log('Message from Unity:', event.nativeEvent.message);
  };

  const handleButtonPress = () => {
    // Send a message to Unity
    if (unityRef.current) {
      unityRef.current.postMessage('GameObjectName', 'MethodName', 'Message');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <UnityView
        ref={unityRef}
        webGLContent={webGLContent} // Only needed for web platform
        style={{ flex: 1 }}
        onUnityMessage={handleUnityMessage}
      />
    </View>
  );
}
```

## Communication between React Native and Unity (WebGL)

### Sending Messages from React Native to Unity

Use the `postMessage` method to send messages to Unity:

```tsx
unityRef.current.postMessage('GameObjectName', 'MethodName', 'Message');
```

This will call the method `MethodName` on the GameObject named `GameObjectName` in Unity, passing the string `Message` as an argument.

### Sending Messages from Unity to React Native

In your Unity WebGL build, use the WebGLHandler to send messages:

```csharp
// Attach this script to a GameObject in your Unity scene
using UnityEngine;

public class MyGameController : MonoBehaviour
{
    // Reference to the WebGLHandler
    public WebGLHandler webGLHandler;

    void Start()
    {
        if (webGLHandler == null)
        {
            webGLHandler = FindObjectOfType<WebGLHandler>();
        }
    }

    public void SendMessageToReactNative()
    {
        // Send a message to React Native
        if (webGLHandler != null)
        {
            webGLHandler.SendMessageToReact("Hello from Unity WebGL!");
        }
    }
}
```

## Unified API

The same UnityView component and API are used for all platforms (iOS, Android, and Web), allowing for a seamless cross-platform implementation.

### Common Methods

- `postMessage(gameObject, methodName, message)`: Send a message to a Unity GameObject
- `unloadUnity()`: Unload the Unity instance
- `pauseUnity(pause)`: Pause or resume Unity
- `resumeUnity()`: Resume Unity (shorthand for pauseUnity(false))

### Web-Specific Considerations

- On web, make sure to provide the `webGLContent` prop with paths to your Unity WebGL build files.
- WebGL builds handle pause/resume differently from native builds, using Time.timeScale under the hood.
- For the best performance on web, optimize your Unity WebGL build settings (compression, memory, etc.)
