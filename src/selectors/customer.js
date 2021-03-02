import { loyaltyType, isEmpty } from '@open-tender/js'

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
export const selectCustomerCreditCardsForPayment = state => {
  const creditCards = state.data.customer.creditCards.entities
  return creditCards.filter(i => i.has_profile)
}

export const selectCustomerFavorites = state => state.data.customer.favorites
export const selectCustomerHouseAccounts = state =>
  state.data.customer.houseAccounts
export const selectCustomerOrders = state => state.data.customer.orders
export const selectCustomerGroupOrders = state =>
  state.data.customer.groupOrders

export const selectCustomerOrder = state => {
  const { entity: order, loading, error } = state.data.customer.order
  return { order, loading, error }
}

export const selectCustomerLoyalty = state => state.data.customer.loyalty

export const selectCustomerLevelUp = state => {
  const { entities, loading, error } = state.data.customer.levelup
  const levelup = entities.length ? entities[0] : null
  return { levelup, loading, error }
}

export const selectCustomerThanx = state => {
  const { thanx, loading, error } = state.data.customer.thanx
  return { thanx, loading, error }
}

export const selectCustomerQRCode = state => {
  const { qrcode, loading, error } = state.data.customer.qrcode
  return { qrcode, loading, error }
}

export const makeOpenTenderRewards = program => {
  const { name, description, spend, redemption, credit } = program
  const currentSpend = parseFloat(spend.current)
  const threshold = parseFloat(redemption.threshold)
  const remaining = threshold - currentSpend
  const progress = parseInt((currentSpend / threshold) * 100)
  const currentCredit = parseFloat(credit.current)
  return {
    name,
    description,
    progress,
    spend: currentSpend.toFixed(2),
    remaining: remaining.toFixed(2),
    threshold: threshold.toFixed(2),
    credit: currentCredit.toFixed(2),
    towards: `$${redemption.reward} off your order`,
    rewards: [],
  }
}

export const makeThanxRewards = program => {
  const { progress, rewards } = program
  return {
    name: 'Your Progress',
    progress: !isEmpty(progress) ? parseInt(progress.percentage) : null,
    towards: !isEmpty(progress) ? progress.towards : null,
    rewards,
  }
}

export const makeLevelUpRewards = user => {
  if (!user.program) return null
  let { name, description, spend, credit, reward, threshold } = user.program
  credit = parseFloat(credit)
  spend = parseFloat(spend)
  threshold = parseFloat(threshold)
  const remaining = threshold - spend
  const progress = parseInt((spend / threshold) * 100)
  return {
    name,
    description,
    progress,
    spend: spend.toFixed(2),
    remaining: remaining.toFixed(2),
    threshold: threshold.toFixed(2),
    credit: credit.toFixed(2),
    towards: `$${reward} off your order`,
    rewards: [],
  }
}

export const selectCustomerRewards = state => {
  const { loyalty, thanx, levelup } = state.data.customer
  const programs = loyalty.entities.filter(
    i =>
      i.loyalty_type === loyaltyType.CREDIT &&
      (i.spend.order_type === null || i.spend.order_type == 'OLO')
  )
  // if (programs.length) return makeOpenTenderRewards(programs[0])
  if (programs.length) return programs[0]
  const { thanx: program } = thanx
  if (program) return makeThanxRewards(program)
  if (levelup.entities.length) {
    return makeLevelUpRewards(levelup.entities[0])
  }
  return null
}

export const selectCustomerRewardsLoading = state => {
  const { loyalty, thanx, levelup } = state.data.customer
  return (
    loyalty.loading === 'pending' ||
    thanx.loading === 'pending' ||
    levelup.loading === 'pending'
  )
}
