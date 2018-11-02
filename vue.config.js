module.exports = {
  pages: {
    'popup/popup': {
      entry: 'src/popup/popup.js',
      title: 'Popup'
    },
    'options/options': {
      entry: 'src/options/options.js',
      title: 'Options'
    }
  },
  pluginOptions: {
    browserExtension: {
      components: {
        background: true,
        popup: true,
        options: true,
        contentScripts: true
      },
      api: 'chrome',
      componentOptions: {
        background: {
          entry: 'src/background.js'
        },
        contentScripts: {
          entries: {
            'content_scripts/content-script': [
              'src/content_scripts/content-script.js'
            ]
          }
        }
      }
    }
  }
}
