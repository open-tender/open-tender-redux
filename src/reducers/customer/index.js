import { combineReducers } from 'redux'
import account from './account'
import allergens from './allergens'
import addresses from './addresses'
import creditCards from './creditCards'
import giftCards from './giftCards'
import favorites from './favorites'
import houseAccounts from './houseAccounts'
import loyalty from './loyalty'

const customerReducer = combineReducers({
  account,
  allergens,
  addresses,
  creditCards,
  giftCards,
  favorites,
  houseAccounts,
  loyalty,
})

export default customerReducer
