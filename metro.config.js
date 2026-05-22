const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Prefer native builds over browser builds so web-only code (e.g. document) is not bundled for iOS/Android.
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// expo-sqlite on web imports wa-sqlite.wasm — Metro must treat .wasm as assets.
// https://docs.expo.dev/versions/v54.0.0/sdk/sqlite/#web-setup
config.resolver.assetExts.push('wasm');

// SharedArrayBuffer for wa-sqlite (OPFS) requires COOP/COEP on the dev server.
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    return middleware(req, res, next);
  };
};

module.exports = config;
