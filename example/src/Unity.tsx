import UnityView from '@azesmway/react-native-unity'
import React, { useEffect, useRef } from 'react'
import { View, Platform } from 'react-native'

interface IMessage {
  gameObject: string
  methodName: string
  message: string
}

// Sample WebGL content configuration for web platform
const webGLContent = {
  loaderUrl: 'https://example.com/unity-build/WebGL.loader.js', // Replace with your actual Unity WebGL build paths
  dataUrl: 'https://example.com/unity-build/WebGL.data',
  frameworkUrl: 'https://example.com/unity-build/WebGL.framework.js',
  codeUrl: 'https://example.com/unity-build/WebGL.wasm',
  // Optional properties
  streamingAssetsUrl: 'https://example.com/unity-build/StreamingAssets',
  companyName: 'YourCompany',
  productName: 'UnityDemo',
  productVersion: '1.0.0',
}

const Unity = () => {
  const unityRef = useRef<any>()
  const message: IMessage = {
    gameObject: '[Scripts]',
    methodName: 'InitModule',
    message: '{"scene": "GeoPoints"}'
  }

  useEffect(() => {
    // Send a message to Unity after a delay
    const timer = setTimeout(() => {
      if (unityRef && unityRef.current) {
        unityRef.current.postMessage(message.gameObject, message.methodName, message.message)
      }
    }, 6000)

    return () => {
      clearTimeout(timer)
      console.log('unmount')
    }
  }, [])

  // Log Unity messages
  const handleUnityMessage = (result: any) => {
    console.log('onUnityMessage ===> ', result.nativeEvent.message)
  }

  return (
    // If you wrap your UnityView inside a parent, please take care to set dimensions to it (with `flex:1` for example).
    // See the `Know issues` part in the README.
    <View style={{ flex: 1 }}>
      <UnityView
        ref={unityRef}
        style={{ flex: 1 }}
        // Pass WebGL content configuration for web platform
        webGLContent={Platform.OS === 'web' ? webGLContent : undefined}
        onUnityMessage={handleUnityMessage}
      />
    </View>
  )
}

export default Unity
