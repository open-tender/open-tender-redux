export const selectOrderFulfillment = state => {
  const { orderFulfillment, loading, error } = state.data.orderFulfillment
  return { orderFulfillment, loading, error }
}
