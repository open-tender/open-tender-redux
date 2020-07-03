import { combineReducers } from 'redux'
import account from './account'
import allergens from './allergens'
import addresses from './addresses'

const customerReducer = combineReducers({
  account,
  allergens,
  addresses,
})

export default customerReducer
