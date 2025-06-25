const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Bundle optimization configurations
config.resolver.platforms = ['ios', 'android', 'web'];

// Asset optimization
config.transformer.assetPlugins = ['expo-asset/tools/hashAssetFiles'];

// Minimize bundle size
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Tree shaking optimization
config.resolver.unstable_enableSymlinks = false;
config.resolver.unstable_enablePackageExports = true;

// Cache configuration for faster builds
config.cacheStores = [
  {
    name: 'filesystem',
    options: {
      cacheDirectory: './node_modules/.cache/metro',
    },
  },
];

// Source map configuration for production
if (process.env.NODE_ENV === 'production') {
  config.serializer.createModuleIdFactory = () => (path) => {
    // Create stable module IDs for better caching
    const hash = require('crypto').createHash('md5').update(path).digest('hex');
    return hash.substr(0, 8);
  };
}

// Bundle splitting configuration
config.serializer.getModulesRunBeforeMainModule = () => [
  require.resolve('react-native/Libraries/Core/InitializeCore'),
];

// Compression and optimization
config.transformer.enableBabelRCLookup = false;
config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');

// Asset resolver optimization
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'db',
  'mp3',
  'ttf',
  'obj',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
];

module.exports = config; 