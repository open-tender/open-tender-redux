import { combineReducers } from 'redux'
import order from './order'
import revenueCenters from './revenueCenters'
import validTimes from './validTimes'
import menu from './menu'
import menuItems from './menuItems'
import allergens from './allergens'
import checkout from './checkout'
import notifications from './notifications'
import confirmation from './confirmation'
import customer from './customer'
import resetPassword from './resetPassword'
import signUp from './signUp'
import groupOrder from './groupOrder'

const openTenderReducer = combineReducers({
  order,
  revenueCenters,
  validTimes,
  menu,
  menuItems,
  allergens,
  checkout,
  notifications,
  confirmation,
  resetPassword,
  signUp,
  customer,
  groupOrder,
})

export default openTenderReducer
