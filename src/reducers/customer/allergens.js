import { entitiesReducer } from '../../utils'

export const name = 'customer/allergens'
export const entity = 'CustomerAllergens'
export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
