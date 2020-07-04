import { combineReducers } from 'redux'
import order from './order'
import revenueCenters from './revenueCenters'
import menu from './menu'
import menuItems from './menuItems'
import allergens from './allergens'
import checkout from './checkout'
import notifications from './notifications'
import confirmation from './confirmation'
import customer from './customer'
import resetPassword from './resetPassword'
import signUp from './signUp'

const openTenderReducer = combineReducers({
  order,
  revenueCenters,
  menu,
  menuItems,
  allergens,
  checkout,
  notifications,
  confirmation,
  resetPassword,
  signUp,
  customer,
})

export default openTenderReducer
