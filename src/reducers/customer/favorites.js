import { entitiesReducer } from '../../utils'

export const name = 'customer/favorites'
export const entity = 'CustomerFavorites'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
