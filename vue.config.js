// vue.config.js
var path = process.env.NODE_ENV === 'production' ? '' : '';

module.exports = {
  configureWebpack: {
    output: {
      publicPath: path,
    },
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 800000,
      },
    },
  },
  publicPath: path,
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: true,
    },
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'public/service-worker.js',
    },
  },
  runtimeCompiler: true,
};
