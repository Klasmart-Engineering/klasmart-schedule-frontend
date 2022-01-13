const fs = require("fs");
const path = require("path");
const {
  createDoc
} = require("./spread")
const {
  formatJson
} = require("./format");
const memorize = require('lodash/memoize');
const chalk = require('chalk');
const g = chalk.bold.green;
const lastPermissionSheets = {
  key: '1C1g-Q3UUsBBnDTXIFq75FSNdRN9Mr1qbJzyTYlpTePU',
  gids: ['582683793'],
}

const getOnlineLocale = memorize(async function () {
  const {
    key,
    gids
  } = lastPermissionSheets;
  const doc = await createDoc(key);
  return []
    .concat(...await Promise.all(gids.map(async (gid) => {
      const sheet = doc.sheetsById[gid];
      const rows = await sheet.getRows();
      return rows;
    })))
    .reduce((result, item) => {
      const {
        Code: code
      } = item;
      if (code) result[code] = code
      return result;
    }, {})

})
const permissionDir = path.resolve(__dirname, "../src/api");

function writepermissionJson(permissionDef) {
  const filePath = path.resolve(permissionDir, `permission_all.json`)
  fs.writeFileSync(filePath, formatJson(permissionDef));
  console.log(g('Successfully'), ` update file: `, g(`${permissionDir}/permission_all.json`));
  // write types
  const typeFilePath = path.resolve(permissionDir, `PermissionType.ts`);
  fs.writeFileSync(typeFilePath, `enum PermissionType${formatJson(permissionDef).replace(/"(.*)":(.*)/g, '$1 = $2')}
  export default PermissionType;`);
  console.log(g('Successfully'), ` update file: `, g(`${permissionDir}/PermissionType.ts`));
}

async function syncPermission() {
  const permissionDef = await getOnlineLocale();
  writepermissionJson(permissionDef)
}
syncPermission()