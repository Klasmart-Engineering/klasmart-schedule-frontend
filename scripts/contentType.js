const request = require('request');
const path = require('path');
const { rmdirSync, unlinkSync, writeFileSync } = require('fs');
const unzipper = require('unzipper');
const cliProgress = require('cli-progress');
const chalk = require('chalk');

const g = chalk.bold.green;
const r = chalk.bold.red;
const assetDir = path.resolve(__dirname, '../src/assets/h5p/libraries');
const contentTypeFilePath = path.resolve(assetDir, 'content-types.auto.json');


function fetchContentTypes() {
  const options = {
    'method': 'POST',
    'url': 'https://api.h5p.org/v1/content-types/',
    'headers': {'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': '__cfduid=d57bdfce6d350c55ebef4000842b0c8c61607073600'
    },
    json:true,
    form: {
      'core_api_version': '1.24',
      'disabled': '0',
      'h5p_version': '1.24.0',
      'local_id': '1770663860',
      'platform_name': 'H5P-Editor-NodeJs',
      'platform_version': '0.10',
      'type': 'local',
      'uuid': '8de62c47-f335-42f6-909d-2d8f4b7fb7f5'
    }
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response, result) { 
      if (error) reject(error);
      resolve(result);
    });
  })
}

function downloadContentTypeLibrary(id) {
  const url = `https://api.h5p.org/v1/content-types/${id}`;
  return new Promise((resolve, reject) => {
    request.get(url)
      .pipe(unzipper.Extract({ path: assetDir }))
      .on('close', () => {
        console.log(g('\tSuccessfully'), ' download and extract Library ', g(id));
        resolve();
      })
      .on('error', reject)
    ;
  });

}


async function main() {
  const contentTypeInfo = await fetchContentTypes();
  writeFileSync(contentTypeFilePath, JSON.stringify(contentTypeInfo, null, 2));
  console.log(g('Successfully'), ` create ${contentTypeFilePath}`);
  const contentTypeIds = contentTypeInfo.contentTypes.filter(x => x.example).map(x => x.id);
  console.log('contentTypeIds = ', contentTypeIds);
  const total = contentTypeIds.length;
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(total, 0);
  for (const [index, id] of contentTypeIds.entries()) {
    try {
      await downloadContentTypeLibrary(id);
    } catch(err) {
      console.log(r('Error: '), 'id = ', r(id), 'index = ', r(index), 'err = ', r(err));
    }
    bar.increment();
  }
  bar.stop();
  rmdirSync(path.resolve(assetDir, 'content'), { recursive: true });
  unlinkSync(path.resolve(assetDir, 'h5p.json'));
}

main();
