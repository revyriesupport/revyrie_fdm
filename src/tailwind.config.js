/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

const path = require('path')

module.exports = {
  mode: 'jit',
  darkMode: 'media',
  theme: {
    screens: {
      md: '750px',
      lg: '990px',
      xl: '1400px',
    },
    colors: {
      ink: 'rgba(var(--color-base-text), <alpha-value>)',
      accent1: 'rgba(var(--color-base-accent-1), <alpha-value>)',
      accent2: 'rgba(var(--color-base-accent-2), <alpha-value>)',
      background1: 'rgba(var(--color-base-background-1), <alpha-value>)',
      background2: 'rgba(var(--color-base-background-2), <alpha-value>)',
      white: 'rgba(255,255,255, <alpha-value>)',
      grey: 'rgba(222,222,222, <alpha-value>)',
    },
    fontSize: {
      xs: ['14px', { lineHeight: '24px', letterSpacing: '-0.03em' }],
      sm: ['16px', { lineHeight: '28px', letterSpacing: '-0.03em' }],
      lg: ['18px', { lineHeight: '28px', letterSpacing: '-0.03em' }],
      xl: ['24px', { lineHeight: '36px', letterSpacing: '-0.03em' }],
      '2xl': ['36px', { lineHeight: '48px', letterSpacing: '-0.032em' }],
      '3xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.032em' }],
      '4xl': ['56px', { lineHeight: '64px', letterSpacing: '-0.032em' }],
      '5xl': ['80px', { lineHeight: '80px', letterSpacing: '-0.032em' }],
    },
    fontFamily: {
      body: 'var(--font-body-family)',
      heading: 'var(--font-heading-family)',
    },
    container: {
      center: true,
      padding: '1rem'
    },
    boxShadow: {
      'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    extend: {},
  },
  plugins: [],
  content: [
    path.resolve(__dirname, '**/*.{js,vue}'),
    path.resolve(__dirname, './vue/components/*.vue'),
    path.resolve(__dirname, '../shopify/**/*.liquid'),
    path.resolve(__dirname, '../shopify/config/*.json'),
    path.resolve(__dirname, '../shopify/layout/*.liquid'),
    path.resolve(__dirname, '../shopify/assets/*.liquid'),
    path.resolve(__dirname, '../shopify/sections/*.liquid'),
    path.resolve(__dirname, '../shopify/snippets/*.liquid'),
    path.resolve(__dirname, '../shopify/templates/*.{json,liquid}'),
  ]
}
