const { defineConfig } = require("@vue/cli-service");
const { VantResolver } = require("unplugin-vue-components/resolvers");
const ComponentsPlugin = require("unplugin-vue-components/webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //关闭语法检查
  configureWebpack: {
    plugins: [
      // @ts-ignore
      ComponentsPlugin({
        resolvers: [VantResolver()],
      }),
    ],
  },
});
