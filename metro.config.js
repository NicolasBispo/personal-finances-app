const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte ao Tamagui
config.resolver.sourceExts.push('cjs');

module.exports = config; 