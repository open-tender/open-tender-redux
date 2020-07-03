import { combineReducers } from 'redux'
import account from './account'
import allergens from './allergens'
import addresses from './addresses'
import creditCards from './creditCards'

const customerReducer = combineReducers({
  account,
  allergens,
  addresses,
  creditCards,
})

export default customerReducer
