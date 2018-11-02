export function insertCSS (sheetURL) {
  const head = document.head || document.documentElement
  const link = document.createElement('link')
  link.setAttribute('href', sheetURL)
  link.setAttribute('rel', 'stylesheet')
  head.insertBefore(link, head.lastChild)
}
