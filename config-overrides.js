/* config-overrides.js */
const { addBabelPlugins } = require('customize-cra');
const {alias, configPaths} = require('react-app-rewire-alias');
const aliasMap = configPaths('./tsconfig.paths.json') // or jsconfig.paths.json


module.exports = alias(aliasMap);
module.exports = function override(config){
  const modifiedConfig = alias(aliasMap)(config)
  if(process.env.NODE_ENV !== 'development'){
    return addBabelPlugins(
      "transform-remove-console"
    )(modifiedConfig);
  }else{
    return modifiedConfig;
  }
};
