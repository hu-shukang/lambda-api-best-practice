/** @type {import('prettier').Config} */
export default {
  printWidth: 120,
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  endOfLine: 'lf',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderParserPlugins: ['typescript'],
  importOrder: [
    '^tsconfig-paths/register$',
    '^source-map-support/register$',
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSortSpecifiers: true,
  importOrderSeparation: true,
};
