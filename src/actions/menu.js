import { makeRequestedIso, validateCart } from 'open-tender-js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_MENU,
  RESET_MENU_VARS,
  RESET_CART_ERRORS,
  SET_CART_ERRORS,
  FETCH_MENU,
} from '../reducers/menuItems'
import { setCart, setAlert, refreshRevenueCenter } from './order'

// action creators

export const resetMenu = () => ({ type: RESET_MENU })
export const resetMenuVars = () => ({ type: RESET_MENU_VARS })
export const resetCartErrors = () => ({ type: RESET_CART_ERRORS })
export const setCartErrors = (newCart, errors) => ({
  type: SET_CART_ERRORS,
  payload: { newCart, errors },
})

// async action creators

export const fetchMenu = menuVars => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_MENU))
  const { revenueCenterId, serviceType, requestedAt } = menuVars
  try {
    const requestedIso = makeRequestedIso(requestedAt)
    const menu = await api.getMenu(revenueCenterId, serviceType, requestedIso)
    const { cart } = getState().order
    const { menu: categories, sold_out_items: soldOut } = menu
    const { newCart, errors } = validateCart(cart, categories, soldOut)
    if (errors) {
      dispatch(setCartErrors(newCart, errors))
      dispatch(setAlert({ type: 'cartErrors' }))
    } else {
      dispatch(setCart(newCart))
    }
    dispatch(fulfill(FETCH_MENU, { categories, soldOut, menuVars }))
  } catch (err) {
    dispatch(refreshRevenueCenter(menuVars))
    dispatch(reject(FETCH_MENU, err))
  }
}
