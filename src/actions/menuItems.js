import { pending, fulfill, reject } from '../utils'
import {
  SET_MENU_ITEMS,
  RESET_MENU_ITEMS,
  FETCH_MENU_ITEMS,
} from '../reducers/menuItems'

// action creators

export const resetMenuItems = () => ({ type: RESET_MENU_ITEMS })
export const setMenuItems = menuItems => ({
  type: SET_MENU_ITEMS,
  payload: menuItems,
})

// async action creators

export const fetchMenuItems = ({ revenueCenterId, serviceType }) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_MENU_ITEMS))
  try {
    const menuItems = await api.getMenuItems(revenueCenterId, serviceType)
    dispatch(fulfill(FETCH_MENU_ITEMS, menuItems))
  } catch (err) {
    dispatch(reject(FETCH_MENU_ITEMS, err))
  }
}
