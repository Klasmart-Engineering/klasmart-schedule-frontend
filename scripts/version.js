const execSync = require('child_process').execSync;
const fs = require('fs');
const versionPath = 'index.html';
const buildPath = 'build';
const commit = execSync('git show -s --format=%H').toString().trim();
const path = `${buildPath}/${versionPath}`

let contentStr = "";

if (fs.existsSync(path)) {
  contentStr = fs.readFileSync(path).toString();
}

let date = new Date(execSync('git show -s --format=%cd').toString());
fs.writeFileSync(path, `${contentStr}<!--${commit} | ${date}-->`);

// 程序执行结束
console.info('\x1B[32m%s\x1b[0m', [
  "J$\\   $$\\ $$$$$$\\ $$$$$$$\\   $$$$$$\\  $$\\       $$$$$$\\   $$$$$$\\  $$$$$$$\\  \n" +
  "$$ | $$  |\\_$$  _|$$  __$$\\ $$  __$$\\ $$ |     $$  __$$\\ $$  __$$\\ $$  __$$\\ \n" +
  "$$ |$$  /   $$ |  $$ |  $$ |$$ /  \\__|$$ |     $$ /  $$ |$$ /  $$ |$$ |  $$ |\n" +
  "$$$$$  /    $$ |  $$ |  $$ |\\$$$$$$\\  Y$ |     $$ |  $$ |$$ |  $$ |$$$$$$$  |\n" +
  "$$  $$<     $$ |  $$ |  $$ | \\____$$\\ $$ |     $$ |  $$ |$$ |  $$ |$$  ____/ \n" +
  "$$ |\\$$\\    $$ |  $$ |  $$ |$$\\   $$ |$$ |     $$ |  $$ |$$ |  $$ |$$ |      \n" +
  "$$ | \\$$\\ $$$$$$\\ $$$$$$$  |\\$$$$$$  |$$$$$$$$\\ $$$$$$  | $$$$$$  |X$ |      \n" +
  "\\__|  \\__|\\______|\\_______/  \\______/ \\________|\\______/  \\______/ \\__|"
].join('\n'));
