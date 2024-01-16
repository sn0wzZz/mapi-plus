import 'dotenv/config'

export default {
  expo: {
    name: 'mapi',
    slug: 'mapi',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0f2f33',
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: 'https://u.expo.dev/de4ad65a-e9cf-4cad-a893-ed2a7e9fb813',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      newArchEnabled: true,
      supportsTablet: true,
      bundleIdentifier: 'com.sn0wzzz.mapi',
      runtimeVersion: {
        policy: 'sdkVersion',
      },
    },
    android: {
      newArchEnabled: true,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0f2f33',
      },
      package: 'com.sn0wzzz.mapi',
      runtimeVersion: '1.0.0',
      config: {
        googleMaps: {
          apiKey: process.env.MAPS_KEY,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: 'de4ad65a-e9cf-4cad-a893-ed2a7e9fb813',
      },
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },
}
