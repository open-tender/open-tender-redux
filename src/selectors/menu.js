export const selectMenu = state => state.data.menu
export const selectMenuLoading = state => state.data.menu.loading === 'pending'
export const selectMenuError = state => state.data.menu.error
export const selectSoldOut = state => state.data.menu.soldOut
export const selectCartErrors = state => state.data.menu.cartErrors
