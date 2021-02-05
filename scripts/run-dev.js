const os = require('os');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const hrstart = process.hrtime();

let path;
process.env['NODE_ENV'] = 'development';

if (os.type() === 'Linux' || os.type() === 'Darwin') {
  path = 'build/src/app.js';
} else if (os.type() === 'Windows_NT') {
  path = 'build\\src\\app.js';
} else {
  console.warn('Unsupported OS');
  return;
}

(async () => {
  let out = await exec('tsc -p .');
  console.log(out.stdout);
  console.error(out.stderr);

  const hrend = process.hrtime(hrstart);
  console.info(`Build time: ${hrend[0]}s ${(hrend[1] / 1000000).toFixed()}ms`);
  console.log(`\x1b[32mRunning\x1b[0m \x1b[4m${path}\x1b[0m`);

  out = await exec(`node ${path}`);
})();
