export const selectOrdersSearchResults = state => {
  const { entities: orders, loading, error } = state.data.ordersSearch
  return { orders, loading, error }
}
