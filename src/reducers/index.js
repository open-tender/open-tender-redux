import { combineReducers } from 'redux'
import order from './order'
import revenueCenters from './revenueCenters'

const rootReducer = combineReducers({
  order,
  revenueCenters,
})

export default rootReducer
