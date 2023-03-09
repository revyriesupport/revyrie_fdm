const path = require('path')
import { config } from './utils';

module.exports = {
  config,
  content: [
    path.resolve(__dirname, '../shopify/sections/featured-collection.liquid')
  ]
}