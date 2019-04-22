import is from 'electron-is'

export default {
  index: {
    attrs: {
      title: 'Covear',
      width: 1024,
      height: 768,
      minWidth: 840,
      minHeight: 420,
      transparent: !is.windows()
    },
    bindCloseToHide: true,
    url: is.dev() ? `http://localhost:9080` : `file://${__dirname}/index.html`
  }
}
