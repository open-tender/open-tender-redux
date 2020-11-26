export const selectSignUp = state => state.data.signUp
export const selectLevelUp = state => state.data.levelup
export const selectResetPassword = state => state.data.resetPassword
export const selectCustomer = state => state.data.customer.account
export const selectCustomerProfile = state =>
  state.data.customer.account.profile
export const selectToken = state =>
  state.data.customer.account.auth
    ? state.data.customer.account.auth.access_token
    : null
export const selectCustomerAllergens = state => state.data.customer.allergens
export const selectCustomerAddresses = state => state.data.customer.addresses
export const selectCustomerGiftCards = state => state.data.customer.giftCards
export const selectCustomerCreditCards = state =>
  state.data.customer.creditCards
export const selectCustomerFavorites = state => state.data.customer.favorites
export const selectCustomerLoyalty = state => state.data.customer.loyalty
export const selectCustomerHouseAccounts = state =>
  state.data.customer.houseAccounts
export const selectCustomerOrders = state => state.data.customer.orders
export const selectCustomerGroupOrders = state =>
  state.data.customer.groupOrders

export const selectCustomerOrder = state => {
  const { entity: order, loading, error } = state.data.customer.order
  return { order, loading, error }
}

export const selectCustomerLevelUp = state => {
  const { entities, loading, error } = state.data.customer.levelup
  const levelup = entities.length ? entities[0] : null
  return { levelup, loading, error }
}

export const selectCustomerThanx = state => {
  const { thanx, loading, error } = state.data.customer.thanx
  return { thanx, loading, error }
}
