const path = require('path')

module.exports = {
  // publicPath: '.',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          math: 'parens-division'
        }
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
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
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
