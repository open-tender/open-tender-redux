import { entitiesReducer } from '../../utils'

export const name = 'customer/rewards'
export const entity = 'CustomerRewards'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
