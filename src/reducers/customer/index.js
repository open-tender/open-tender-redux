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
import thanx from './thanx'
import qrcode from './qrcode'

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
  thanx,
  qrcode,
})

export default customerReducer
