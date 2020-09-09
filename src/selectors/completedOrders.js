export const selectCompletedOrders = state => {
  const { entities: orders, loading, error } = state.data.completedOrders
  return { orders, loading, error }
}
