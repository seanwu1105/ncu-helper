export function insertCSS (sheetURL) {
  const head = document.head || document.documentElement
  const link = document.createElement('link')
  link.href = sheetURL
  link.rel = 'stylesheet'
  head.insertBefore(link, head.lastChild)
}
