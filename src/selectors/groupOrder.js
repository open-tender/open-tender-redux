export const selectGroupOrder = state => state.data.groupOrder
export const selectGroupOrderToken = state => state.data.groupOrder.token
export const selectSpendingLimit = state => {
  const { cartGuest, spendingLimit } = state.data.groupOrder
  return cartGuest && spendingLimit ? parseFloat(spendingLimit) : null
}
