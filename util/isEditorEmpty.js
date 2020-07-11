export const isEditorEmpty = (json) => {
  return !json || (json.content.length === 1 && !json.content[0].content)
}
