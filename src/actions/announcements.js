import { pending, fulfill, reject, handleError } from '../utils'
import {
  RESET_ANNOUNCEMENTS,
  FETCH_ANNOUNCEMENTS,
  FETCH_ANNOUNCEMENT_PAGE,
} from '../reducers/announcements'

// action creators

export const resetAnnouncements = () => ({ type: RESET_ANNOUNCEMENTS })

// async action creators

export const fetchAnnouncements = page => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_ANNOUNCEMENTS))
  try {
    const { data } = await api.getAnnouncements(page)
    dispatch(fulfill(FETCH_ANNOUNCEMENTS, data))
  } catch (err) {
    dispatch(reject(FETCH_ANNOUNCEMENTS, err))
  }
}

export const fetchAnnouncementPage = page => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_ANNOUNCEMENT_PAGE))
  const seconds = Math.floor(Date.now() / 1000)
  const { pages } = getState().data.announcements
  const existing = pages ? pages.find(i => i.page === page) : null
  if (existing && seconds - existing.lastUpdated < 3600) {
    dispatch({ type: `${FETCH_ANNOUNCEMENT_PAGE}/cached` })
  } else {
    try {
      const response = await api.getAnnouncementPage(page)
      const settings = { ...response }
      delete settings.announcements
      const entities = response.announcements
      const payload = {
        settings,
        entities,
        page,
        lastUpdated: seconds,
      }
      dispatch(fulfill(FETCH_ANNOUNCEMENT_PAGE, payload))
    } catch (err) {
      const payload = { page, error: handleError(err) }
      dispatch({ type: `${FETCH_ANNOUNCEMENT_PAGE}/rejected`, payload })
    }
  }
}
