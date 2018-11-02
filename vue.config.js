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
            'content_scripts/graduate': 'src/content_scripts/graduate.js',
            'content_scripts/lms': 'src/content_scripts/lms.js',
            'content_scripts/portal': 'src/content_scripts/portal.js',
            'content_scripts/score-inquiries-header': 'src/content_scripts/score-inquiries-header.js',
            'content_scripts/score-inquiries': 'src/content_scripts/score-inquiries.js'
          }
        }
      }
    }
  }
}
