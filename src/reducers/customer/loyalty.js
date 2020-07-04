import { entitiesReducer } from '../../utils'

export const name = 'customer/loyalty'
export const entity = 'CustomerLoyalty'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
