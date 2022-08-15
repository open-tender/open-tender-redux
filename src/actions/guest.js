import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill } from '../utils'
import {
  FETCH_GUEST,
  FETCH_GUEST_THANX,
  RESET_GUEST,
  RESET_GUEST_ERRORS,
  SET_GUEST_EMAIL,
} from '../reducers/guest'

export const resetGuest = () => ({ type: RESET_GUEST })
export const resetGuestErrors = () => ({ type: RESET_GUEST_ERRORS })
export const setGuestEmail = email => ({
  type: SET_GUEST_EMAIL,
  payload: email,
})

export const fetchGuest = (email, callback) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_GUEST))
  try {
    const response = await api.getGuest(email)
    dispatch(fulfill(FETCH_GUEST, response))
    if (callback) callback()
  } catch (err) {
    let errors = makeFormErrors(err)
    if (errors.form && errors.form.includes('Unknown 500 error')) {
      errors = { form: 'Invalid email address. Please try again.' }
    }
    dispatch({ type: `${FETCH_GUEST}/rejected`, payload: { errors, email } })
  }
}

export const fetchGuestThanx =
  (email, callback, origin) => async (dispatch, getState) => {
    const { api } = getState().config
    if (!api) return
    dispatch(pending(FETCH_GUEST_THANX))
    try {
      await api.postThanxLogin(email, origin)
      dispatch(fulfill(FETCH_GUEST_THANX, { email }))
      if (callback) callback()
    } catch (err) {
      let errors = makeFormErrors(err)
      dispatch({
        type: `${FETCH_GUEST_THANX}/rejected`,
        payload: { errors, email },
      })
    }
  }
