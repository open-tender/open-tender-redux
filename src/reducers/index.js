import { combineReducers } from 'redux'
import order from './order'
import revenueCenters from './revenueCenters'

const openTenderReducer = combineReducers({
  order,
  revenueCenters,
})

export default openTenderReducer
