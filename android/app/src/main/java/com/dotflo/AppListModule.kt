package com.dotflo

import android.content.Intent
import android.content.pm.PackageManager
import android.content.pm.ResolveInfo
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import java.io.ByteArrayOutputStream
import com.facebook.react.bridge.*

class AppListModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AppListModule"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val packageManager = reactApplicationContext.packageManager
            val intent = Intent(Intent.ACTION_MAIN, null)
            intent.addCategory(Intent.CATEGORY_LAUNCHER)
            
            val resolveInfoList: List<ResolveInfo> = packageManager.queryIntentActivities(intent, 0)
            val apps = WritableNativeArray()

            for (resolveInfo in resolveInfoList) {
                val appInfo = WritableNativeMap()
                val applicationInfo = resolveInfo.activityInfo.applicationInfo
                
                appInfo.putString("name", packageManager.getApplicationLabel(applicationInfo).toString())
                appInfo.putString("packageName", applicationInfo.packageName)
                appInfo.putString("className", resolveInfo.activityInfo.name)
                
                // Get app icon as base64
                try {
                    val icon = packageManager.getApplicationIcon(applicationInfo)
                    val iconBase64 = drawableToBase64(icon)
                    appInfo.putString("icon", iconBase64)
                } catch (e: Exception) {
                    appInfo.putString("icon", "")
                }
                
                apps.pushMap(appInfo)
            }
            
            promise.resolve(apps)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    @ReactMethod
    fun launchApp(packageName: String, className: String, promise: Promise) {
        try {
            val intent = Intent()
            intent.setClassName(packageName, className)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactApplicationContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message)
        }
    }

    private fun drawableToBase64(drawable: Drawable): String {
        try {
            val bitmap = if (drawable is BitmapDrawable && drawable.bitmap != null) {
                drawable.bitmap
            } else {
                // Handle vector drawables and other types
                val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 96
                val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 96
                
                val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bitmap)
                drawable.setBounds(0, 0, width, height)
                drawable.draw(canvas)
                bitmap
            }
            
            // Resize to standard size to reduce data
            val resizedBitmap = Bitmap.createScaledBitmap(bitmap, 48, 48, true)
            
            val byteArrayOutputStream = ByteArrayOutputStream()
            resizedBitmap.compress(Bitmap.CompressFormat.PNG, 90, byteArrayOutputStream)
            val byteArray = byteArrayOutputStream.toByteArray()
            
            return Base64.encodeToString(byteArray, Base64.NO_WRAP)
        } catch (e: Exception) {
            return ""
        }
    }
}