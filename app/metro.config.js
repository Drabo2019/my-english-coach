const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// expo-sqlite on web ships a wa-sqlite .wasm binary.
config.resolver.assetExts.push('wasm');

module.exports = config;
