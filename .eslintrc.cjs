require('@alattalatta/eslint-config/patch')

module.exports = {
  root: true,
  extends: ['@alattalatta/eslint-config', 'plugin:wc/recommended', 'plugin:lit/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/member-ordering': 0,
    '@typescript-eslint/unbound-method': 0,
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
