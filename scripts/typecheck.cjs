/* Check our declarations without requiring React Native's own .d.ts files to pass skipLibCheck: false. */
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'tests/tsconfig.json');
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
if (configFile.error) {
  console.error(ts.formatDiagnosticsWithColorAndContext([configFile.error], {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }));
  process.exit(1);
}

const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, path.dirname(configPath));
const program = ts.createProgram(config.fileNames, config.options);
const consumerPath = path.join(root, 'tests/types.test.tsx');
const resolved = ts.resolveModuleName('react-native-switch-selector', consumerPath, config.options, ts.sys).resolvedModule;
const declaration = resolved && program.getSourceFile(resolved.resolvedFileName);
const consumer = program.getSourceFile(consumerPath);
if (!declaration || !consumer) {
  throw new Error('Could not resolve the package declaration and consumer type test');
}

const diagnostics = [
  ...config.errors,
  ...program.getOptionsDiagnostics(),
  ...program.getGlobalDiagnostics(),
  ...program.getSyntacticDiagnostics(declaration),
  ...program.getSemanticDiagnostics(declaration),
  ...program.getSyntacticDiagnostics(consumer),
  ...program.getSemanticDiagnostics(consumer),
];

if (diagnostics.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }));
  process.exit(1);
}
console.log('Package declarations and consumer type tests passed.');
