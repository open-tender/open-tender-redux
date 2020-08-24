import { pending, fulfill, reject } from '../utils'
import {
  SET_MENU_PAGES,
  RESET_MENU_PAGES,
  FETCH_MENU_PAGES,
} from '../reducers/menuPages'

// action creators

export const resetMenuPages = () => ({ type: RESET_MENU_PAGES })
export const setMenuPages = menuPages => ({
  type: SET_MENU_PAGES,
  payload: menuPages,
})

// async action creators

export const fetchMenuPages = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_MENU_PAGES))
  try {
    const menuPages = await api.getMenuPages()
    dispatch(fulfill(FETCH_MENU_PAGES, menuPages))
  } catch (err) {
    dispatch(reject(FETCH_MENU_PAGES, err))
  }
}
