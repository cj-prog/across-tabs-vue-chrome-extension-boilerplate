const path = require('path');

const chromeExtensionRoot = './chrome_extension/';
// Constants
module.exports = Object.freeze({
  // Paths
  P: {
    dist_chrome: path.join(__dirname, '/dist_chrome'),
    chrome: {
      background: chromeExtensionRoot + 'background.js',
      content: chromeExtensionRoot + 'content.js',
    },
  },
});
