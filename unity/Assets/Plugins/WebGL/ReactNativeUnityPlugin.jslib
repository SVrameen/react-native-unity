// ReactNativeUnityPlugin.jslib - Save this in Unity Project under Assets/Plugins/WebGL
mergeInto(LibraryManager.library, {

  // Function to send messages from Unity to React Native
  SendMessageToReactNative: function(message) {
    // Try window.ReactNativeWebView.postMessage for React Native WebView
    if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
      window.ReactNativeWebView.postMessage(UTF8ToString(message));
    }
    // Try custom event handler
    else if (window.ReactNativeUnityPostMessage) {
      window.ReactNativeUnityPostMessage({
        data: UTF8ToString(message)
      });
    }
    // Fallback to regular postMessage
    else {
      window.postMessage(UTF8ToString(message), '*');
    }
  }
});
