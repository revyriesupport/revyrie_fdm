import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import del from "rollup-plugin-delete";
import ESLintPlugin from '@modyqyw/vite-plugin-eslint';
import StylelintPlugin from 'vite-plugin-stylelint';

export default {
  plugins: [
    vue(),
    ESLintPlugin({
      overrideConfigFile: resolve(__dirname, "./.eslintrc.js"),
      include: "../src/**/*.{js,vue}",
    }),
    StylelintPlugin({
      files: '../src/**/*.{vue,css}',
      configFile: resolve(__dirname, './.stylelintrc.js')
    })
  ],
  clearScreen: false,
  css: {
    postcss: resolve(__dirname, "./postcss.config.js"),
  },
  resolve: {
    extensions: ["*", ".js", ".vue", ".json"],
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      "@": resolve(__dirname, "../src/"),
      "@store": resolve(__dirname, "../src/vue/store/"),
      "@render": resolve(__dirname, "../src/vue/components/render/"),
      "@renderless": resolve(__dirname, "../src/vue/components/renderless/"),
      "@shopify-directory": resolve(__dirname, "../shopify/"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        'global-template': resolve(__dirname, "../src/scripts/main.js"),
        'product-template': resolve(__dirname, "../src/scripts/product-template.js"),
        'collection-template': resolve(__dirname, "../src/scripts/collection-template.js"),
        'homepage-template': resolve(__dirname, "../src/scripts/homepage-template.js"),
        'account-template': resolve(__dirname, "../src/scripts/account-template.js"),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: (assetInfo) =>
          assetInfo.name.split("/").pop().split(".").shift() == "main"
            ? "global.css"
            : "[name].[ext]",
      },
      plugins: [
        process.env.NODE_ENV == "production" &&
        del({
          targets: ["../shopify/assets/**/*", "!../shopify/assets/*static*"],
        }),
      ],
    },
    outDir: resolve(__dirname, "../shopify/assets"),
    assetsDir: ".",
    emptyOutDir: false,
  },
};
// assetFileNames: (assetInfo) =>
//           assetInfo.name.split("/").pop().split(".").shift() == "main"
//             ? "bundle.css"
//             : "[name].[ext]",