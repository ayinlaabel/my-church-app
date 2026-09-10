#!/usr/bin/env node
// scripts/build-setup.js

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up build configuration...');

// Get environment
const env = process.env.APP_ENV || 'production';
const isEas = process.env.EAS_BUILD === 'true';
const isIos = process.env.PLATFORM === 'ios' || process.argv.includes('--ios');

console.log(`Environment: ${env}`);
console.log(`EAS Build: ${isEas}`);
console.log(`Platform: ${isIos ? 'iOS' : 'Android'}`);

// Set environment variables for the build
if (isEas) {
  // Force disable new architecture for EAS builds
  process.env.RCT_NEW_ARCH_ENABLED = '';
  process.env.REACT_NATIVE_NEW_ARCH_ENABLED = '0';
  process.env.EXPO_JSI_ENGINE = 'hermes';
  
  console.log('📋 EAS Build Configuration:');
  console.log(`  - RCT_NEW_ARCH_ENABLED: ${process.env.RCT_NEW_ARCH_ENABLED}`);
  console.log(`  - REACT_NATIVE_NEW_ARCH_ENABLED: ${process.env.REACT_NATIVE_NEW_ARCH_ENABLED}`);
  console.log(`  - EXPO_JSI_ENGINE: ${process.env.EXPO_JSI_ENGINE}`);
}

// Update Podfile.properties.json for iOS
if (isIos) {
  const iosDir = path.join(__dirname, '..', 'ios');
  
  // Create ios directory if it doesn't exist
  if (!fs.existsSync(iosDir)) {
    fs.mkdirSync(iosDir, { recursive: true });
  }
  
  const podfilePropsPath = path.join(iosDir, 'Podfile.properties.json');
  const podfileProps = {
    "expo.jsEngine": "hermes",
    "ios.deploymentTarget": "15.1",
    "newArchEnabled": false,
    "ios.useFrameworks": "static",
    "apple.ccacheEnabled": false,
    "apple.privacyManifestAggregationEnabled": true,
    "ios.buildReactNativeFromSource": false,
    "EX_DEV_CLIENT_NETWORK_INSPECTOR": "false"
  };
  
  fs.writeFileSync(podfilePropsPath, JSON.stringify(podfileProps, null, 2));
  console.log('✅ Updated iOS Podfile.properties.json');
  
  // Also ensure Podfile exists with C++20 fixes
  const podfilePath = path.join(iosDir, 'Podfile');
  if (fs.existsSync(podfilePath)) {
    console.log('📦 Podfile exists, ensuring C++20 configuration...');
    // We'll let expo prebuild handle the Podfile
  }
}

console.log('✅ Build setup complete');
