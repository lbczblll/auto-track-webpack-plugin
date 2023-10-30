const { defineConfig } = require('@vue/cli-service')
const { AutoTrackPlugin } = require('auto-track-webpack-plugin')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new AutoTrackPlugin({ buriedPoint: 'this.$common.buriedFun' })]
  }
})
