import { entitiesReducer } from '../../utils'

export const name = 'customer/addresses'
export const entity = 'CustomerAddresses'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
