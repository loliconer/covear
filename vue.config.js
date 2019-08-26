const path = require('path')

class ReplaceVendorsPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(this.constructor.name, htmlPluginData => {
        htmlPluginData.html = htmlPluginData.html.replace('vue.runtime.js', 'vue.runtime.min.js')
        return htmlPluginData
      })
    })
  }
}

module.exports = {
  // publicPath: '.',
  css: {
    loaderOptions: {
      less: {
        strictMath: 'on'
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8020',
        changeOrigin: true
      },
      '/upload': {
        target: 'http://192.168.1.14',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete('prefetch')
  },
  configureWebpack: {
    entry: {
      app: './src/renderer/index.js'
    },
    externals: {
      vue: 'Vue'
    },
    resolve: {
      extensions: ['*', '.js', '.vue', '.json'],
      alias: {
        src: path.join(__dirname, 'src')
      }
    },
    plugins: process.env.NODE_ENV === 'production' ? [
      new ReplaceVendorsPlugin()
    ] : []
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/background.js',
      builderOptions: {
        productName: 'Covear',
        appId: 'dapp.lovue.covear',
        directories: {
          output: 'release'
        },
        dmg: {
          window: {
            width: 540,
            height: 380
          },
          contents: [{
            x: 410,
            y: 230,
            type: 'link',
            path: '/Application'
          }, {
            x: 130,
            y: 230,
            type: 'file'
          }]
        },
        win: {
          target: [{
            target: 'nsis',
            arch: ['x64']
          }, {
            target: 'zip',
            arch: ['x64']
          }, {
            target: 'portable',
            arch: ['x64']
          }]
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        linux: {
          category: 'Network',
          target: ['deb', 'snap', 'AppImage']
        }
      }
    }
  }
}
