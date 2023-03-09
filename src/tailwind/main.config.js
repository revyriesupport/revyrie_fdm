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
    path.resolve(__dirname, '../../shopify/assets/*.js'),
    path.resolve(__dirname, '../../shopify/**/*.liquid')
  ]
}