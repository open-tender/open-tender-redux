export const selectMenuDisplay = state => {
  const { categories, loading, error } = state.data.menuDisplay
  return { categories, loading, error }
}
