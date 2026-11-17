const { execFileSync } = require('child_process');

const buildTarget = process.env.JOPPA_BUILD_TARGET;

if (!['prod', 'test'].includes(buildTarget)) {
  throw new Error('JOPPA_BUILD_TARGET must be set to "test" or "prod"');
}

console.log(`Building Joppa UI for ${buildTarget} API`);

execFileSync('npm', ['run', `build:${buildTarget}`], {
  stdio: 'inherit'
});
