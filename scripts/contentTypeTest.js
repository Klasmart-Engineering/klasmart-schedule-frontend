const babel = require('@babel/core');
const path = require('path');

const { code } = babel.transformFileSync(path.resolve(__dirname, 'contentTypeDemo.js'), { plugins: ['macros'] });

console.log(code);