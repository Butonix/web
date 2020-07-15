export const capitalizedName = (name) => {
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map(
      (word) => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()
    )
    .join(' ')
}
