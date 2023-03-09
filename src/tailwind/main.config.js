/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const path = require('path')
import { config } from './utils';

module.exports = {
  config,
  content: [
    path.resolve(__dirname, '**/*.{js,vue}'),
    path.resolve(__dirname, '../vue/components/*.vue'),
    path.resolve(__dirname, '../../shopify/**/*.liquid'),
    path.resolve(__dirname, '../../shopify/config/*.json'),
    path.resolve(__dirname, '../../shopify/layout/*.liquid'),
    path.resolve(__dirname, '../../shopify/assets/*.liquid'),
    path.resolve(__dirname, '../../shopify/sections/*.liquid'),
    path.resolve(__dirname, '../../shopify/snippets/*.liquid'),
    path.resolve(__dirname, '../../shopify/templates/*.{json,liquid}'),
  ],
}