package org.peekvision.cordova.devicesettings;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager.NameNotFoundException;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;

import android.os.Build;
import android.provider.Settings;
import android.util.Log;

public class DeviceSettings extends CordovaPlugin {
    private static final String TAG = "DeviceSettings";
    private static Context ctx;
    boolean debugEnabled = false;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        ctx = this.cordova.getActivity().getApplicationContext();
        try {
            if (action.equals("getDeveloperMode")) {
                callbackContext.success(this.getDeveloperMode() ? 1 : 0);
            } else {
            if (action.equals("getAutoTimeMode")) {
                callbackContext.success(this.getAutoTimeMode() ? 1 : 0);
            } else
            if (action.equals("getAutoTimeZoneMode")) {
                callbackContext.success(this.getAutoTimeZoneMode() ? 1 : 0);
            } else
                 handleError("Invalid action", callbackContext);
                 return false;
            }
        } catch(Exception e ) {
             handleError("Exception occurred: ".concat(e.getMessage()), callbackContext);
             return false;
        }
        return true;
    }

    public boolean getDeveloperMode() throws Exception {
        Log.i(TAG, "getDeveloperMode()");
        boolean result;
        Context context = this.cordova.getActivity().getApplicationContext();
        if (Build.VERSION.SDK_INT >= 17) { // Jelly_Bean_MR1 and above
            result = Settings.Global.getInt(context.getContentResolver(), Settings.Global.DEVELOPMENT_SETTINGS_ENABLED, 0) == 1;
        } else { // Pre-Jelly_Bean_MR1
            result = Settings.Secure.getInt(context.getContentResolver(), Settings.Secure.DEVELOPMENT_SETTINGS_ENABLED, 0) == 1;
        }
        return result;
    }


    public boolean getAutoTimeMode() throws Exception {
        Log.i(TAG, "getAutoTimeMode()");
        boolean result;
        Context context = this.cordova.getActivity().getApplicationContext();
               
        result = Settings.System.getInt(context.getContentResolver(), Settings.System.AUTO_TIME, 0) == 1;
        
        return result;
    }

    public boolean getAutoTimeZoneMode() throws Exception {
        Log.i(TAG, "getAutoTimeZoneMode()");
        boolean result;
        Context context = this.cordova.getActivity().getApplicationContext();
               
        result = Settings.System.getInt(context.getContentResolver(), Settings.System.AUTO_TIME_ZONE, 0) == 1;
        
        return result;
    }

    private void handleError(String errorMsg, CallbackContext context){
        try {
            Log.e(TAG, errorMsg);
            context.error(errorMsg);
        } catch (Exception e) {
            Log.e(TAG, e.toString());
        }
    }
}