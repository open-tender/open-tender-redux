import { entitiesReducer } from '../../utils'

export const name = 'customer/houseAccounts'
export const entity = 'CustomerHouseAccounts'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
