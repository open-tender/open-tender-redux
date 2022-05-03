import { entitiesReducer } from '../../utils'

export const name = 'customer/communicationPreferences'
export const entity = 'CustomerCommunicationPreferences'

export default (state, action) => {
  return entitiesReducer(state, action, name, entity)
}
