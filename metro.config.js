// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const {
    wrapWithReanimatedMetroConfig,
  } = require('react-native-reanimated/metro-config');
/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const dotenv = require('dotenv');
config.resolver.sourceExts.push('sql');

// Explicitly ensure JSON files are treated as source files, not assets
config.resolver.sourceExts.push('json');

config.transformer = {
  ...config.transformer,
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};
module.exports = wrapWithReanimatedMetroConfig(config);
