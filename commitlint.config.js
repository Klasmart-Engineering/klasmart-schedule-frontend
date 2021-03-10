
module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'scope-case': [2, 'always', ['upper-case']],
    'scope-enum': [0],
    'function-rules/scope-enum': [
      2,
      'always',
      (parsed) => {
        if (['ci', 'chore'].includes(parsed.type)) return [true];
        if (/\w+-\d+(\s\w+-\d+)*?/.test(parsed.scope)) return [true];
        return [false, `scope must be provided!`];
      },
    ],
  },
}