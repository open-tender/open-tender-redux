import { addDistance } from 'open-tender-js'
import { getRevenueCenters } from '../services/requests'

const initState = {
  entities: [],
  loading: 'idle',
  error: null,
}

const REVENUE_CENTERS = 'revenueCenters/setRevenueCenters'

export const setRevenueCenters = (payload) => ({
  type: REVENUE_CENTERS,
  payload,
})

export const fetchRevenueCenters = ({
  revenue_center_type,
  is_outpost,
  lat,
  lng,
}) => async (dispatch, getState) => {
  try {
    if (lat) lat = parseFloat(lat).toFixed(7)
    if (lng) lng = parseFloat(lng).toFixed(7)
    const response = await getRevenueCenters(getState().config.api, {
      revenue_center_type,
      is_outpost,
      lat,
      lng,
    })
    const revenueCenters =
      lat && lng ? addDistance(response.data, { lat, lng }) : response.data
    const payload = { entities: revenueCenters, loading: 'idle' }
    dispatch(setRevenueCenters(payload))
  } catch (err) {
    console.log(err)
  }
}

export default (state = initState, action) => {
  switch (action.type) {
    case REVENUE_CENTERS:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
