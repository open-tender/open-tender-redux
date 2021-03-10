const initState = {
  settings: null,
  entities: [],
  loading: 'idle',
  error: null,
}

const NAME = 'announcements'

export const RESET_ANNOUNCEMENTS = `${NAME}/resetAnnouncements`
export const FETCH_ANNOUNCEMENTS = `${NAME}/fetchAnnouncements`
export const FETCH_ANNOUNCEMENT_PAGE = `${NAME}/fetchAnnouncementPage`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_ANNOUNCEMENTS:
      return { ...initState }

    // fetch announcements
    case `${FETCH_ANNOUNCEMENTS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_ANNOUNCEMENTS}/fulfilled`:
      return {
        ...state,
        entities: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_ANNOUNCEMENTS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    // fetch announcement page (both secttings and announcements)
    case `${FETCH_ANNOUNCEMENT_PAGE}/pending`:
      return {
        ...state,
        settings: null,
        entities: [],
        loading: 'pending',
        error: null,
      }
    case `${FETCH_ANNOUNCEMENT_PAGE}/fulfilled`: {
      const { settings, entities } = action.payload
      return {
        ...state,
        settings,
        entities,
        loading: 'idle',
        error: null,
      }
    }
    case `${FETCH_ANNOUNCEMENT_PAGE}/rejected`:
      return {
        ...state,
        settings: null,
        entities: [],
        loading: 'idle',
        error: action.payload,
      }

    default:
      return state
  }
}
