require('@alattalatta/eslint-config/patch')

module.exports = {
  root: true,
  extends: ['@alattalatta/eslint-config', 'plugin:wc/recommended', 'plugin:lit/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
    wc: {
      elementBaseClasses: ['LitElement'],
    },
  },
}
