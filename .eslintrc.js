module.exports = {
  root: true,
  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    }
  },

  plugins: [ '@typescript-eslint' ],

  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended'
  ],

  env: {
    es6: true,
    node: true,
    browser: true
  },

  rules: {
    semi: [
      'error',
      'never'
    ],
    'no-extra-semi': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    curly: [
      'error',
      'all'
    ],
    'brace-style': 'error',
    'require-atomic-updates': 'off',
    'no-useless-catch': 'off',
    'no-extra-boolean-cast': 'error',
    'no-extra-label': 'error',
    'no-unused-labels': 'error',
    'dot-notation': 'error',
    'no-var': 'error',
    'no-extra-parens': 'error',
    'no-unused-vars': [
      'error',
      {
        args: 'after-used'
      }
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 'first'
      }
    ],
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'no-multi-spaces': 'error',
    'space-in-parens': [
      'error',
      'never'
    ],
    'space-before-blocks': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': [
      'error',
      'always'
    ],
    'block-spacing': 'error',
    'semi-spacing': 'error',
    'key-spacing': [
      'error',
      {
        afterColon: true,
        mode: 'strict'
      }
    ],
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true
      }
    ],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return'
      }
    ],
    'comma-style': [
      'error',
      'last'
    ],
    'comma-dangle': [
      'error',
      'never'
    ],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true
      }
    ],
    'function-paren-newline': [
      'error',
      'consistent'
    ],
    'function-call-argument-newline': [
      'error',
      'consistent'
    ],
    'func-call-spacing': [
      'error',
      'never'
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'arrow-spacing': 'error',
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          consistent: true,
          multiline: true,
          minProperties: 2
        },
        ObjectPattern: {
          consistent: true,
          multiline: true
        },
        ImportDeclaration: {
          consistent: true,
          multiline: true
        },
        ExportDeclaration: {
          consistent: true,
          multiline: true
        }
      }
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: false
      }
    ],
    'array-bracket-newline': [
      'error',
      {
        multiline: true
      }
    ],
    'array-bracket-spacing': [
      'error',
      'always'
    ],
    'array-element-newline': [
      'error',
      'consistent'
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'lines-between-class-members': [
      'error',
      'always'
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1,
        maxBOF: 0,
        maxEOF: 1
      }
    ],
    'eol-last': [
      'error',
      'always'
    ],
    'newline-per-chained-call': [
      'error',
      {
        ignoreChainWithDepth: 2
      }
    ],
    'padded-blocks': [
      'error',
      'never'
    ],
    quotes: [
      'error',
      'single'
    ],
    'quote-props': [
      'error',
      'as-needed'
    ],
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
        ignoreReadBeforeAssign: true
      }
    ],
    'sort-imports': [
      'error',
      {
        allowSeparatedGroups: true,
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: [
          'all',
          'single',
          'multiple',
          'none'
        ]
      }
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'off'
  }
}
