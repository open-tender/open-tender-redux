import { addDistance } from 'open-tender-js'
import { getRevenueCenters } from '../services/requests'
import OpenTenderAPI from '../services'

export const SET_REVENUE_CENTERS = 'revenueCenters/setRevenueCenters'

export const setRevenueCenters = (payload) => ({
  type: SET_REVENUE_CENTERS,
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
    const { app, brand } = getState().config
    const api = new OpenTenderAPI(app, brand.brandId)
    const response = await getRevenueCenters(api, {
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
    console.error(err)
  }
}
