import { pending, fulfill, reject } from '../utils'
import {
  SET_MENU_DISPLAY,
  RESET_MENU_DISPLAY,
  FETCH_MENU_DISPLAY,
} from '../reducers/menuDisplay'

// action creators

export const resetMenuDisplay = () => ({ type: RESET_MENU_DISPLAY })
export const setMenuDisplay = categories => ({
  type: SET_MENU_DISPLAY,
  payload: categories,
})

// async action creators

export const fetchMenuDisplay = ({
  revenueCenterId,
  serviceType,
  weekday,
  minutes,
}) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_MENU_DISPLAY))
  try {
    const { menu: categories } = await api.getMenuDisplay(
      revenueCenterId,
      serviceType,
      weekday,
      minutes
    )
    dispatch(fulfill(FETCH_MENU_DISPLAY, categories))
  } catch (err) {
    dispatch(reject(FETCH_MENU_DISPLAY, err))
  }
}
