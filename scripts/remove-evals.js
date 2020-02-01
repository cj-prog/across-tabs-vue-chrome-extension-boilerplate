#!/usr/bin/env node
const P = require('../global_constants').P;

const path = require('path');
const fs = require('fs');

const BUNDLE_DIR = P.dist_chrome;
const bundles = ['background.js', 'main.js'];

const evalRegexForProduction = /;([a-z])=function\(\){return this}\(\);try{\1=\1\|\|Function\("return this"\)\(\)\|\|\(0,eval\)\("this"\)}catch\(t\){"object"==typeof window&&\(\1=window\)}/g;
const evalRegexForDevelopment = /;\\r\\n\\r\\n\/\/ This works in non-strict mode(?:.){1,304}/g;

const removeEvals = file => {
  console.info(`Removing eval() from ${file}`);

  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const regex =
        process.env.NODE_ENV === 'production'
          ? evalRegexForProduction
          : evalRegexForDevelopment;

      if (!regex.test(data)) {
        reject(`No CSP specific code found in ${file}.`);
        return;
      }

      data = data.replace(regex, '=window;');

      fs.writeFile(file, data, err => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  });
};

const main = () => {
  bundles.forEach(bundle => {
    removeEvals(path.join(BUNDLE_DIR, bundle))
      .then(() => console.info(`Bundle ${bundle}: OK`))
      .catch(console.error);
  });
};

main();
