const path = require('path');
const { hashElement } = require('folder-hash');
const { writeFileSync } = require('fs');
const { formatJson } = require('./format');

const h5pDir = path.resolve(__dirname, '../public/h5p');
const h5pPkgFile = path.resolve(h5pDir, 'package.json');
const excludeGlob = 'package.json';
const h5pPkg = require(h5pPkgFile);

function saveVersion(version) {
  writeFileSync(h5pPkgFile, formatJson({ ...h5pPkg, version }));
}

function getH5pVersion() {
  const hashOptions = { encoding: 'hex', files: { exclude: [ excludeGlob ] }};
  return hashElement(h5pDir, hashOptions).then(({ hash }) => {
    return `1.0.0-alpha.${hash}`;
  })
}

async function main() {
  const version = await getH5pVersion();
  saveVersion(version);
}

main();
