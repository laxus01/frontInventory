const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    public: 'subdomain.domain.ext:port'
  },
  transpileDependencies: [
    'vuetify'
  ]
})
