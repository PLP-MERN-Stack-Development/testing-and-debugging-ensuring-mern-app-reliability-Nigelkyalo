module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
  ignorePatterns: ['node_modules/', 'coverage/', 'dist/']
};

