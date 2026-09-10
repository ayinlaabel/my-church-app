#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔧 Running prebuild hook...');

// Force enable new architecture for Reanimated
process.env.RCT_NEW_ARCH_ENABLED = '1';
process.env.REACT_NATIVE_NEW_ARCH_ENABLED = '1';

console.log('Enabled new architecture for Reanimated compatibility');