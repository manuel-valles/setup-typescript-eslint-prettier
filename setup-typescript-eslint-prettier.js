const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const exec = util.promisify(cp.exec);
const writeFile = util.promisify(fs.writeFile);

const prettierConfigVscode = {
  'editor.codeActionsOnSave': {
    'source.fixAll': true,
  },
  '[json]': {
    'editor.defaultFormatter': 'vscode.json-language-features',
  },
  '[javascript]': {
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
  },
  '[typescript]': {
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
  },
};

const eslintRc = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    complexity: ['warn', 10],
    'prefer-const': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: '*', next: 'block' },
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
  },
};

const prettierRc = {
  tabWidth: 2,
  singleQuote: true,
  printWidth: 80,
  trailingComma: 'all',
};

const packages = [
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
  'eslint-config-prettier',
  'eslint-plugin-prettier',
  'eslint',
  'prettier',
];

(async () => {
  const vscodeDirPath = path.join(__dirname, '.vscode');

  try {
    fs.statSync(vscodeDirPath).isDirectory();
  } catch (error) {
    fs.mkdirSync(vscodeDirPath);
  }

  const workspacePath = path.join(__dirname, '.vscode', 'settings.json');
  let workspaceSettings = {};

  try {
    fs.statSync(workspacePath).isFile();
  } catch (error) {}

  workspaceSettings = {
    ...workspaceSettings,
    ...prettierConfigVscode,
  };

  await Promise.all([
    writeFile(workspacePath, JSON.stringify(workspaceSettings, null, 2)).then(
      () => console.log('...Writing new .vscode/settings.json')
    ),
    writeFile('.eslintrc.json', JSON.stringify(eslintRc, null, 2)).then(() =>
      console.log('...Writing new .eslintrc.json')
    ),
    writeFile('.prettierrc.json', JSON.stringify(prettierRc, null, 2)).then(
      () => console.log('...Writing new .prettierrc.json')
    ),
    exec(`npm i -D ${packages.join(' ')}`)
      .then(({ stdout }) => console.log(stdout))
      .catch(console.log),
  ]);

  console.log(
    'Finished installing all dependencies and configuring files.\nYou might need to restart VSCode for the ESLint & Prettier settings to take effect.'
  );
})();
