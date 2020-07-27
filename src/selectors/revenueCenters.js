export const selectRevenueCenters = state => state.data.revenueCenters
export const selectRevenueCenterCount = state =>
  state.data.revenueCenters
    ? state.data.revenueCenters.revenueCenters.length
    : 0
