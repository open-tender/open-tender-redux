import { entitiesReducer } from '../../utils'

export const name = 'customer/levelup'
export const entity = 'CustomerLevelUp'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
