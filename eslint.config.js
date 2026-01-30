const js = require('@eslint/js');
const airbnbBase = require('eslint-config-airbnb-base');
const prettierConfig = require('eslint-config-prettier');
const jestPlugin = require('eslint-plugin-jest');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['node_modules/', 'dist/', 'coverage/'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'writable',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...airbnbBase.rules,
      ...prettierConfig.rules,
      'no-console': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/tests/**',
            'tests/**',
            '**/*.test.js',
            'scripts/**',
            'eslint.config.js',
            'jest.config.js',
          ],
        },
      ],
      'consistent-return': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.json'],
        },
      },
    },
  },
  {
    files: ['tests/**/*.js', '**/*.test.js', '**/tests/**/*.js'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
        beforeAll: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'no-unused-expressions': 'off',
    },
  },
];
