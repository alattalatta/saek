require('@alattalatta/eslint-config/patch')

module.exports = {
  root: true,
  extends: [
    '@alattalatta/eslint-config/react',
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  }
}
