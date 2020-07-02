import { combineReducers } from 'redux'
import order from './order'
import revenueCenters from './revenueCenters'
import menu from './menu'
import menuItems from './menuItems'
import allergens from './allergens'
import checkout from './checkout'
import notifications from './notifications'

const openTenderReducer = combineReducers({
  order,
  revenueCenters,
  menu,
  menuItems,
  allergens,
  checkout,
  notifications,
})

export default openTenderReducer
