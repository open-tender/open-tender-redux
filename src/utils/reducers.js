const initState = {
  entities: [],
  loading: 'idle',
  error: null,
}

export const entitiesReducer = (state = initState, action, name, entity) => {
  switch (action.type) {
    case `${name}/reset${entity}`:
      return { ...initState }
    case `${name}/set${entity}`:
      return { ...state, entities: action.payload }
    case `${name}/fetch${entity}/pending`:
      return { ...state, loading: 'pending' }
    case `${name}/fetch${entity}/fulfilled`:
      return {
        ...state,
        entities: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${name}/fetch${entity}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
