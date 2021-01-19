export const selectOrderRating = state => {
  const { orderRating, loading, error } = state.data.orderRating
  return { orderRating, loading, error }
}
