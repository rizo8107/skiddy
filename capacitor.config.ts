import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skiddy.app',
  appName: 'Skiddy',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'skiddy.keystore',
      keystoreAlias: 'skiddy',
      keystorePassword: 'skiddy123',
      keystoreKeyPassword: 'skiddy123',
    }
  }
}

export default config;
