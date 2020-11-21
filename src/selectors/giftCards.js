export const selectGiftCards = state => {
  const { success, loading, error } = state.data.giftCards
  return { success, loading, error }
}
