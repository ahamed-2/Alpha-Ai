package com.alphacoreai

import android.content.Context
import android.hardware.camera2.CameraManager
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class SystemControlModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SystemControl"
    }

    @ReactMethod
    fun toggleFlashlight(status: Boolean, promise: Promise) {
        try {
            val cameraManager = reactApplicationContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
            val cameraId = cameraManager.cameraIdList[0] // Usually the back camera
            cameraManager.setTorchMode(cameraId, status)
            promise.resolve("Flashlight turned ${if(status) "ON" else "OFF"}")
        } catch (e: Exception) {
            promise.reject("FLASHLIGHT_ERROR", e.message)
        }
    }

    @ReactMethod
    fun launchApp(packageName: String, promise: Promise) {
        try {
            val launchIntent: Intent? = reactApplicationContext.packageManager.getLaunchIntentForPackage(packageName)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactApplicationContext.startActivity(launchIntent)
                promise.resolve("App launched")
            } else {
                promise.reject("APP_NOT_FOUND", "Application not installed")
            }
        } catch (e: Exception) {
            promise.reject("LAUNCH_ERROR", e.message)
        }
    }
}
