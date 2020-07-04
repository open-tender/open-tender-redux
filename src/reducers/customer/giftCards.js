import { entitiesReducer } from '../../utils'

export const name = 'customer/giftCards'
export const entity = 'CustomerGiftCards'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
