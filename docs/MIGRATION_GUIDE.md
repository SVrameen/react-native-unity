# Migrating to Cross-Platform Support

This guide will help you migrate your existing React Native Unity app to support web platforms.

## Step 1: Update Your Unity Project

1. Add WebGL as a build target in your Unity project:
   - Open your Unity project
   - Go to **File > Build Settings**
   - Select **WebGL** from the platform list and click **Switch Platform**

2. Add the WebGL handler to your Unity project:
   - Copy the `WebGLHandler.cs` file to your Unity project's Assets folder
   - Create a `Plugins/WebGL` folder in your Assets directory
   - Copy `ReactNativeUnityPlugin.jslib` to the `Plugins/WebGL` folder

3. Add communication handlers to your scene:
   - Create a new GameObject in your main scene
   - Attach the `WebGLHandler` script to this GameObject
   - Make sure this GameObject is marked "Don't Destroy On Load" if you switch between scenes

## Step 2: Build Unity WebGL

1. Configure WebGL build settings:
   - In **Player Settings > WebGL Settings**, ensure:
     - **Compression Format**: Disabled or Gzip for development (Brotli for production)
     - **WebGL Template**: Minimal

2. Build your WebGL project:
   - Choose **Build** from the Build Settings dialog
   - Select a directory for the WebGL build output
   - Your build will include files like `*.loader.js`, `*.framework.js`, `*.data`, and `*.wasm`

## Step 3: Deploy WebGL Build

1. Host your WebGL build files:
   - Deploy your WebGL build to a static web server or CDN
   - Make sure CORS is enabled on your server to allow loading from your React Native Web app

2. Update your React Native app:
   - Update your UnityView component to include the `webGLContent` prop:

```tsx
// App.tsx or your component file
import React, { useRef } from 'react';
import { Platform, View } from 'react-native';
import UnityView from '@azesmway/react-native-unity';

export default function App() {
  const unityRef = useRef(null);

  // Configure Unity WebGL content (only used on Web platform)
  const webGLContent = {
    loaderUrl: 'https://your-cdn.com/unity-build/WebGL.loader.js',
    dataUrl: 'https://your-cdn.com/unity-build/WebGL.data',
    frameworkUrl: 'https://your-cdn.com/unity-build/WebGL.framework.js',
    codeUrl: 'https://your-cdn.com/unity-build/WebGL.wasm',
  };

  return (
    <View style={{ flex: 1 }}>
      <UnityView
        ref={unityRef}
        style={{ flex: 1 }}
        // Pass WebGL content only for web platform
        webGLContent={Platform.OS === 'web' ? webGLContent : undefined}
        onUnityMessage={(event) => console.log(event.nativeEvent.message)}
      />
    </View>
  );
}
```

## Step 4: Communication Between React Native and Unity

Unity to React Native:
- For iOS/Android: Use the existing `UnitySendMessage` approach
- For WebGL: Use the `WebGLHandler.SendMessageToReact` method

```csharp
// In your Unity script
public class MyGameController : MonoBehaviour
{
    private void Start()
    {
        // Find WebGL handler if available
        WebGLHandler webGLHandler = FindObjectOfType<WebGLHandler>();

        // Send message to React Native
        #if UNITY_WEBGL && !UNITY_EDITOR
            if (webGLHandler != null)
                webGLHandler.SendMessageToReact("Hello from Unity WebGL!");
        #else
            // For mobile platforms, use your existing approach
            // Example: UnityMessageManager.Instance.SendMessageToRN("Hello from Unity Mobile!");
        #endif
    }
}
```

React Native to Unity:
- Use the unified `postMessage` method which works across all platforms

```tsx
// In your React Native component
const sendMessageToUnity = () => {
  if (unityRef.current) {
    unityRef.current.postMessage('GameObjectName', 'MethodName', 'Message');
  }
};
```

## Common Issues and Solutions

1. **CORS errors when loading WebGL assets**:
   - Ensure your server has CORS headers enabled
   - Example for NGINX:
     ```
     location /unity-builds/ {
       add_header 'Access-Control-Allow-Origin' '*';
       add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
       add_header 'Access-Control-Allow-Headers' '*';
     }
     ```

2. **WebGL build is slow or unresponsive**:
   - Optimize your Unity WebGL build settings
   - Consider using compressed textures
   - Reduce quality settings for web platform

3. **Unity WebGL not loading in React Native Web**:
   - Check browser console for errors
   - Verify all WebGL content URLs are correct and accessible
   - Ensure browser supports WebGL (check with `https://get.webgl.org/`)

4. **Audio not working on Web**:
   - Unity WebGL requires user interaction before audio can play
   - Add a button to your UI that triggers audio playback after user interaction
