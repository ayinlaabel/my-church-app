#!/usr/bin/env node
// scripts/post-install.js

console.log('✅ Build completed successfully!');

if (process.env.EAS_BUILD === 'true') {
  console.log('🎉 EAS build finished');
  console.log(`Environment: ${process.env.APP_ENV || 'production'}`);
  console.log(`Platform: ${process.env.PLATFORM || 'unknown'}`);
}
