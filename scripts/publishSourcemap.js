const publishSourcemap = require("@newrelic/publish-sourcemap").publishSourcemap;
const listSourcemaps = require("@newrelic/publish-sourcemap").listSourcemaps;
const deleteSourcemap = require('@newrelic/publish-sourcemap').deleteSourcemap;
const fs = require("fs");
const path = require("path");

const BASE_URL_PATH = `${process.env.REACT_APP_BASE_DOMAIN}/static/js/`;
const YOUR_NEW_RELIC_APP_ID = "322535870";
const YOUR_NEW_RELIC_USER_API_KEY = "NRAK-Z0REBBZKUM8SXY5NQHP2DTYQJ9P";
const SOURCE_MAP_UPLOAD_HOST = "https://sourcemaps.service.eu.newrelic.com";

const sourceMapDir = path.resolve(__dirname, "../build/static/js/");

const optionConfig = {
  applicationId: YOUR_NEW_RELIC_APP_ID,
  apiKey: YOUR_NEW_RELIC_USER_API_KEY,
  sourcemapUploadHost: SOURCE_MAP_UPLOAD_HOST
};

const splits = (i) => i.split(".");

const optionConfigAssembly = [];

function readFileList(dirs, optionConfigAssembly = []) {
  const sources = fs.readdirSync(dirs);
  sources.forEach((dir, key) => {
    if (splits(dir).pop() === "js") optionConfigAssembly.push({
      javascriptUrl: BASE_URL_PATH + dir,
      sourcemapPath: dirs + "/" + sources.filter((i) => splits(i).pop() === "map" && i.includes(dir)).shift(), ...optionConfig
    });
  });
  return publish(optionConfigAssembly);
}

function publish(optionConfigAssembly) {
  return Promise.all(
    optionConfigAssembly.map((config) => {
      return new Promise((resolve, reject) => {
        publishSourcemap(config, (err) => {
          if (err) {
            reject(err)
          }else {
            resolve(`${config.javascriptUrl} Sourcemap upload done`)
          }
        });
      })
    })
  );
}

readFileList(sourceMapDir, optionConfigAssembly).then((value)=>{
  console.log(value)
}).catch(err=>{
  console.log(err)
});

function listPublishedMaps() {
  listSourcemaps({
    limit: [50],
    offset: [0],
    ...optionConfig
  }, (err, res) => {
    console.log(err, res);
  });
}

function deletePublishedMaps(id) {
  deleteSourcemap({
    sourcemapId: id,
    ...optionConfig
  },(err) => { console.log(err || 'Deleted source map')})
}


