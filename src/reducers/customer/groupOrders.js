import { entitiesReducer } from '../../utils'

export const name = 'customer/groupOrders'
export const entity = 'CustomerGroupOrders'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
