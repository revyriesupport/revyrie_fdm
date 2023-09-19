module.exports = {
  extends: 'stylelint-config-recommended',
  plugins: [
    /**
     * add plugins
     * docs: https://stylelint.io/user-guide/configure#plugins
     */
  ],
  ignoreFiles: [
    /**
     * ignore certain files
     * docs: https://stylelint.io/user-guide/configure#ignorefiles
     */
    // 'my-file.css',
    // '**/my-directory/*.css'
  ],
  rules: {
    /**
     * add custom rules
     * docs: https://stylelint.io/user-guide/rules/list
     */
    'at-rule-no-unknown': null,
    'no-descending-specificity': null
  },
  customSyntax: 'postcss-html'
}