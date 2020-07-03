import { entitiesReducer } from '../../utils'

export const name = 'customer/creditCards'
export const entity = 'CustomerCreditCards'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
