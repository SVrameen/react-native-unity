// WebGLHandler.cs - Add this script to your Unity project
using UnityEngine;
using System.Runtime.InteropServices;

public class WebGLHandler : MonoBehaviour
{
    // Import JavaScript function to send messages back to React Native
    [DllImport("__Internal")]
    private static extern void SendMessageToReactNative(string message);

    private void Awake()
    {
        // Don't destroy this object when loading new scenes
        DontDestroyOnLoad(this.gameObject);
    }

    // Method to be called from Unity to send messages to React Native
    public void SendMessageToReact(string message)
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
            SendMessageToReactNative(message);
        #endif
    }

    // Method to control time scale (used for pause/resume functionality)
    public void SetTimeScale(string timeScaleStr)
    {
        if (float.TryParse(timeScaleStr, out float timeScale))
        {
            Time.timeScale = timeScale;
        }
    }
}
