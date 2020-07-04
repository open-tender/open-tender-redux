import { entitiesReducer } from '../../utils'

export const name = 'customer/orders'
export const entity = 'CustomerOrders'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
