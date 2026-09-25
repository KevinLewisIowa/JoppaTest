const { execFileSync } = require('child_process');

const buildTarget = process.env.JOPPA_BUILD_TARGET ||
  (process.env.HEROKU_APP_NAME === 'joppa-ui-prod' ? 'prod' : 'test');

if (!['prod', 'test'].includes(buildTarget)) {
  throw new Error(`Unsupported JOPPA_BUILD_TARGET: ${buildTarget}`);
}

execFileSync('npm', ['run', `build:${buildTarget}`], {
  stdio: 'inherit'
});
