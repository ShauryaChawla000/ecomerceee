module.exports = {
  enabled: false,
  root: true,
  extends: ['plugin:@next/next/recommended', '@payloadcms'],
  ignorePatterns: ['**/payload-types.ts'],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'no-console': 'off',
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  },
}
