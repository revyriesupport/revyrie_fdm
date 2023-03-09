const path = require('path')

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss')(path.resolve(__dirname, '../src/tailwind.config.js')),
    require('autoprefixer')
  ]
}

// module.exports = {
//   plugins: [
//       require('postcss-import')({
//         plugins: [],
//         path: ['./node_modules'],
//       }),
//       require('tailwindcss')(path.resolve(__dirname, '../src/tailwind.config.js')),
//       require('postcss-preset-env')({
//         autoprefixer: { },
//         features: {
//             'nesting-rules': true
//         }
//       })
//   ]
// };

// module.exports = {
//   modules: true,
//   plugins: {
//     ['postcss-multiple-tailwind']: {
//     autoprefixer: {},
//   },
// }



// require('tailwindcss')(path.resolve(__dirname, '../src/tailwind/main.config.js')),
// require('tailwindcss')(path.resolve(__dirname, '../src/tailwind/product.config.js')),
// require('tailwindcss')(path.resolve(__dirname, '../src/tailwind/featured-collection.config.js')),
// const path = require('path')

// module.exports = {
//   plugins: [
//     require('postcss-import'),
//     require('tailwindcss/nesting'),
//     require('tailwindcss')(path.resolve(__dirname, '../src/tailwind.config.js')),
//     require('autoprefixer')
//   ]
// }
