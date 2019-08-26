const fs = require('fs')

fs.copyFileSync('node_modules/lovue/dist/lovue.min.css', 'public/css/vendors/lovue.min.css')
fs.copyFileSync('node_modules/lovue/dist/lovue.min.js', 'public/js/vendors/lovue.min.js')
fs.copyFileSync('node_modules/vue/dist/vue.runtime.js', 'public/js/vendors/vue.runtime.js')
fs.copyFileSync('node_modules/vue/dist/vue.runtime.min.js', 'public/js/vendors/vue.runtime.min.js')
