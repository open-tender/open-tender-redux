import { addDistance } from 'open-tender-js'
import { fetch, fulfill, reject } from '../utils'
import {
  RESET_REVENUE_CENTERS,
  FETCH_REVENUE_CENTERS,
} from '../reducers/revenueCenters'

// actions

export const resetRevenueCenters = () => ({ type: RESET_REVENUE_CENTERS })

// action creators

export const fetchRevenueCenters = ({ type, is_outpost, lat, lng }) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(fetch(FETCH_REVENUE_CENTERS))
  try {
    if (lat) lat = parseFloat(lat).toFixed(7)
    if (lng) lng = parseFloat(lng).toFixed(7)
    const { data } = await api.getRevenueCenters(type, is_outpost, lat, lng)
    const revenueCenters = lat && lng ? addDistance(data, { lat, lng }) : data
    dispatch(fulfill(FETCH_REVENUE_CENTERS, revenueCenters))
  } catch (err) {
    dispatch(reject(FETCH_REVENUE_CENTERS, err))
  }
}

// selectors

export const selectRevenueCenters = state => state.data.revenueCenters
