import fs from 'node:fs';

const manifest = 'android/app/src/main/AndroidManifest.xml';
let xml = fs.readFileSync(manifest, 'utf8');
const activity = xml.match(/<activity\b[\s\S]*?>/);
if (!activity) throw new Error('Main activity tag not found');

let tag = activity[0];
if (/android:screenOrientation=/.test(tag)) {
  tag = tag.replace(/android:screenOrientation="[^"]*"/, 'android:screenOrientation="sensorLandscape"');
} else {
  tag = tag.replace('<activity', '<activity\n            android:screenOrientation="sensorLandscape"');
}
xml = xml.replace(activity[0], tag);
fs.writeFileSync(manifest, xml);

const activityPath = 'android/app/src/main/java/com/mochimayhem/game/MainActivity.java';
fs.writeFileSync(activityPath, `package com.mochimayhem.game;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams attrs = getWindow().getAttributes();
            attrs.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(attrs);
        }
        hideSystemBars();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    private void hideSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY |
                View.SYSTEM_UI_FLAG_FULLSCREEN |
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            );
        }
    }
}
`);

const stylesPath = 'android/app/src/main/res/values/styles.xml';
let styles = fs.readFileSync(stylesPath, 'utf8');
const fullscreenItems = `
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowLayoutInDisplayCutoutMode">shortEdges</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@android:color/transparent</item>`;
for (const styleName of ['AppTheme.NoActionBar', 'AppTheme.NoActionBarLaunch']) {
  const openTag = new RegExp(`(<style\\s+name="${styleName}"[^>]*>)`);
  if (!openTag.test(styles)) throw new Error(`Android style not found: ${styleName}`);
  styles = styles.replace(openTag, `$1${fullscreenItems}`);
}
fs.writeFileSync(stylesPath, styles);
console.log('Android orientation: sensorLandscape + immersive edge-to-edge');
