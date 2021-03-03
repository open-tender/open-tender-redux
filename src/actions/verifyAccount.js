import { pending, fulfill, reject } from '../utils'
import { RESET_VERIFY_ACCOUNT, VERIFY_ACCOUNT } from '../reducers/verifyAccount'

export const resetVerifyAccount = () => ({ type: RESET_VERIFY_ACCOUNT })

export const verifyAccount = verifyToken => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(VERIFY_ACCOUNT))
  try {
    await api.postVerifyAccount(verifyToken)
    dispatch(fulfill(VERIFY_ACCOUNT))
  } catch (err) {
    dispatch(reject(VERIFY_ACCOUNT, err))
  }
}
