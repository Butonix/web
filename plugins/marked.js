import marked from 'marked'

const renderer = new marked.Renderer()
renderer.link = function(href, title, text) {
  const link = marked.Renderer.prototype.link.apply(this, arguments)
  return link.replace('<a', '<a target="_blank" rel="noopener"')
}

marked.setOptions({
  renderer
})
