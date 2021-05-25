const path = require('path')
const packagePath = path.resolve(
  __dirname,
  'package.json'
)
const packageFile = require(packagePath)

module.exports = {
  components: 'src/components/**/**.tsx',
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json'
  ).parse, // support tsx
  verbose: true, // print console info
  updateDocs(docs, file) {
    if (docs.doclets.version) {
      const version = packageFile.version

      docs.doclets.version = version
      docs.tags.version[0].description = version
    }
    return docs
  }, // 在使用 @version 时 使用 package.json 的 version
  version: packageFile.version, // use package.json the version
  usageMode: 'expand', // Auto Scaling
  pagePerSection: true, // 是否每页一个组件显示
  title: "kidsloop-doc"
}
