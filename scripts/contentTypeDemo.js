import requireContentType from './contentType.macro';

// const content = requireContentType('asset', 'H5P.MultiChoice-1.14');
// const content = requireContentType('schema', 'H5P.MultiChoice-1.14');
const content = requireContentType('language', 'H5P.MultiChoice-1.14', 'zh');

console.log(content);