module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['jest'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.json'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/'],
  rules: {
    'no-console': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/tests/**', 'tests/**', '**/*.test.js', 'scripts/**'],
      },
    ],
    'consistent-return': 'off',
  },
  overrides: [
    {
      files: ['tests/**/*.js', '**/*.test.js'],
      env: {
        jest: true,
      },
      extends: ['plugin:jest/recommended'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
