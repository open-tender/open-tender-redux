export const selectMenuPages = state => state.data.menuPages

export const selectMenuPagesFiltered = state => {
  const orderType = state.data.order.orderType
  if (!orderType) return []
  return state.data.menuPages.entities.filter(i => i.order_type === orderType)
}
