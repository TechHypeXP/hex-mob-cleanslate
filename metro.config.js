const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable support for TypeScript and React Native
config.resolver.sourceExts.push('cjs');

module.exports = config;