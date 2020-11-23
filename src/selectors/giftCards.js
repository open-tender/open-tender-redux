export const selectGiftCards = state => {
  const { success, loading, error, giftCards } = state.data.giftCards
  return { success, loading, error, giftCards }
}
