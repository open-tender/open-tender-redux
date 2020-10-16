import { combineReducers } from 'redux'
import order from './order'
import revenueCenters from './revenueCenters'
import validTimes from './validTimes'
import menu from './menu'
import menuItems from './menuItems'
import menuPages from './menuPages'
import allergens from './allergens'
import checkout from './checkout'
import notifications from './notifications'
import alerts from './alerts'
import confirmation from './confirmation'
import customer from './customer'
import resetPassword from './resetPassword'
import signUp from './signUp'
import groupOrder from './groupOrder'
import levelup from './levelup'
import orders from './orders'
import completedOrders from './completedOrders'
import ordersSearch from './ordersSearch'
import settings from './settings'
import orderFulfillment from './orderFulfillment'

const openTenderReducer = combineReducers({
  order,
  revenueCenters,
  validTimes,
  menu,
  menuItems,
  menuPages,
  allergens,
  checkout,
  notifications,
  alerts,
  confirmation,
  resetPassword,
  signUp,
  customer,
  groupOrder,
  levelup,
  orders,
  completedOrders,
  ordersSearch,
  settings,
  orderFulfillment,
})

export default openTenderReducer
