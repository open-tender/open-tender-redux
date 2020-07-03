import { combineReducers } from 'redux'
import account from './account'
import allergens from './allergens'

const customerReducer = combineReducers({
  account,
  allergens,
})

export default customerReducer
