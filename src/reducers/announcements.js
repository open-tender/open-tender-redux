const initState = {
  entities: [],
  pages: [],
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
        loading: 'pending',
        error: null,
      }
    case `${FETCH_ANNOUNCEMENT_PAGE}/cached`:
      return { ...state, loading: 'idle' }
    case `${FETCH_ANNOUNCEMENT_PAGE}/fulfilled`: {
      const { page } = action.payload
      const pages = state.pages ? state.pages.filter(i => i.page !== page) : []
      return {
        ...state,
        pages: [...pages, action.payload],
        loading: 'idle',
        error: null,
      }
    }
    case `${FETCH_ANNOUNCEMENT_PAGE}/rejected`: {
      const { error, page } = action.payload
      return {
        ...state,
        pages: state.pages.filter(i => i.page !== page),
        loading: 'idle',
        error,
      }
    }

    default:
      return state
  }
}
