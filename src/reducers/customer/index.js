import { combineReducers } from 'redux'
import account from './account'
import allergens from './allergens'
import addresses from './addresses'
import creditCards from './creditCards'
import giftCards from './giftCards'
import favorites from './favorites'
import houseAccounts from './houseAccounts'
import loyalty from './loyalty'
import orders from './orders'
import order from './order'
import groupOrders from './groupOrders'
import levelup from './levelup'

const customerReducer = combineReducers({
  account,
  allergens,
  addresses,
  creditCards,
  giftCards,
  favorites,
  houseAccounts,
  loyalty,
  orders,
  order,
  groupOrders,
  levelup,
})

export default customerReducer
