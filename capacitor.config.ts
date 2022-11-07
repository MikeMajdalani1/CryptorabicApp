import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cryptorabic.com',
  appName: 'Cryptorabic',
  webDir: 'build',
  bundledWebRuntime: false,

  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: '#102835',
      androidSplashResourceName: 'splash',
      splashFullScreen: true,
      splashImmersive: true,
      showSpinner: false,
      androidScaleType: 'FIT_XY',
    },
  },
};

export default config;

// <style name="AppTheme.NoActionBarLaunch" parent="AppTheme.NoActionBar">
//   <item name="android:background">@drawable/splash</item>
// </style>;
