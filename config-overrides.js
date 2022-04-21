/* config-overrides.js */
const pkg = require("./package.json");
const { override, addBabelPlugins } = require('customize-cra');
const {alias, configPaths} = require('react-app-rewire-alias');
const aliasMap = configPaths('./tsconfig.paths.json') // or jsconfig.paths.json
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const path = require('path');

function myOverrides(config) {
  config.plugins = (config.plugins || []).concat([
    new ModuleFederationPlugin({
      "name": "schedule",
      exposes: {
        "./Schedule": "./src/pages",
      },
      shared: {
        ...pkg.dependencies,
        react: {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['react'],
        },
        'react-dom': {
          eager: true,
          singleton: true,
          requiredVersion: pkg.dependencies['react-dom'],
        }
      },
    }),
  ]);
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify")
  }
  const scopePluginIndex = config.resolve.plugins.findIndex(
    ({ constructor }) => constructor && constructor.name === "ModuleScopePlugin"
  );
  config.resolve.plugins.splice(scopePluginIndex, 1);
  return  alias(aliasMap)(config)
}

module.exports = override(
  myOverrides,
  process.env.NODE_ENV !== 'development' && addBabelPlugins(
    "transform-remove-console"
  )
);