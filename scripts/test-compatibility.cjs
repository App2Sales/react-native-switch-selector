/* Test the packed library with each React Native version in an isolated consumer. */
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const npmCli = process.env.npm_execpath;
if (!npmCli) {
  console.error('Run this script with npm run test:compatibility.');
  process.exit(1);
}
const versions = [
  { native: '0.76.9', react: '18.3.1', reactTypes: '18.3.31', preset: 'react-native' },
  { native: '0.86.3', react: '19.2.3', reactTypes: '19.2.0', preset: '@react-native/jest-preset' },
  { native: '0.87.1', react: '19.2.3', reactTypes: '19.2.0', preset: '@react-native/jest-preset' },
  { native: '0.88.1', react: '19.3.0', reactTypes: '19.3.0', preset: '@react-native/jest-preset' },
];

const requested = process.argv.slice(2);
const selected = requested.length
  ? versions.filter(({ native }) => requested.some((version) => native === version || native.startsWith(`${version}.`)))
  : versions;

if (selected.length === 0 || requested.some((version) => !versions.some(({ native }) => native === version || native.startsWith(`${version}.`)))) {
  console.error(`Choose from: ${versions.map(({ native }) => native).join(', ')}`);
  process.exit(1);
}

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit' });
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'switch-selector-compat-'));
try {
  const packed = JSON.parse(execFileSync(process.execPath, [npmCli, 'pack', '--json', '--pack-destination', temp], {
    cwd: root,
    encoding: 'utf8',
  }));
  const tarball = path.join(temp, packed[0].filename);

  for (const version of selected) {
    console.log(`\nTesting React Native ${version.native} with React ${version.react}`);
    const fixture = path.join(temp, version.native);
    fs.mkdirSync(path.join(fixture, 'tests'), { recursive: true });

    const devDependencies = {
      '@babel/core': '^7.25.2',
      '@react-native/babel-preset': version.native,
      '@testing-library/react-native': '13.3.3',
      '@types/react': version.reactTypes,
      'babel-jest': '29.7.0',
      jest: '29.7.0',
      'react-test-renderer': version.react,
      typescript: '6.0.3',
    };
    if (version.preset !== 'react-native') {
      devDependencies['@react-native/jest-preset'] = version.native;
    }

    writeJson(path.join(fixture, 'package.json'), {
      name: `switch-selector-compat-${version.native}`,
      version: '1.0.0',
      private: true,
      dependencies: {
        react: version.react,
        'react-native': version.native,
        'react-native-switch-selector': `file:${tarball}`,
      },
      devDependencies,
    });
    fs.writeFileSync(path.join(fixture, 'babel.config.cjs'), "module.exports = { presets: ['module:@react-native/babel-preset'] };\n");
    fs.writeFileSync(path.join(fixture, 'jest.config.cjs'), `module.exports = ${JSON.stringify({
      preset: version.preset,
      testMatch: ['<rootDir>/tests/**/*.test.js'],
      transformIgnorePatterns: ['node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-switch-selector)/)'],
    }, null, 2)};\n`);
    fs.copyFileSync(path.join(root, 'tests/SwitchSelector.test.js'), path.join(fixture, 'tests/SwitchSelector.test.js'));
    fs.copyFileSync(path.join(root, 'tests/types.test.tsx'), path.join(fixture, 'tests/types.test.tsx'));
    fs.mkdirSync(path.join(fixture, 'scripts'));
    fs.copyFileSync(path.join(root, 'scripts/typecheck.cjs'), path.join(fixture, 'scripts/typecheck.cjs'));
    const tsconfig = JSON.parse(fs.readFileSync(path.join(root, 'tests/tsconfig.json'), 'utf8'));
    delete tsconfig.compilerOptions.paths;
    writeJson(path.join(fixture, 'tests/tsconfig.json'), tsconfig);

    run(process.execPath, [npmCli, 'install', '--ignore-scripts', '--no-audit', '--no-fund'], fixture);
    run(process.execPath, [path.join(fixture, 'node_modules/jest/bin/jest.js'), '--runInBand'], fixture);
    run(process.execPath, ['scripts/typecheck.cjs'], fixture);

    // Keep disk usage bounded when testing multiple React Native installations.
    fs.rmSync(fixture, { recursive: true, force: true });
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
