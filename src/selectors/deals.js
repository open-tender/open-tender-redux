import { getMinutesfromDate, time24ToMinutes } from '@open-tender/js'

export const selectDeals = state => state.data.deals

export const selectEligibleDeals = state => {
  const { brand } = state.config || {}
  if (!brand || !brand.has_deals) return []
  let { entities: deals } = state.data.deals
  const { orderType, serviceType, revenueCenter } = state.data.order
  if (orderType) {
    deals = deals.filter(i => !i.order_type || i.order_type === orderType)
  }
  if (serviceType) {
    deals = deals.filter(i => !i.service_type || i.service_type === serviceType)
  }
  if (revenueCenter) {
    const { revenue_center_id } = revenueCenter
    deals = deals.filter(
      i =>
        !i.revenue_centers.length ||
        i.revenue_centers
          .map(r => r.revenue_center_id)
          .includes(revenue_center_id)
    )
  }
  const minutes = getMinutesfromDate(new Date())
  deals = deals.filter(i => {
    if (!i.dayparts.length) return true
    const validDayparts = i.dayparts.filter(d => {
      const start = time24ToMinutes(d.start_time)
      const end = time24ToMinutes(d.end_time)
      return start <= minutes <= end
    })
    return validDayparts.length > 0
  })
  return deals
}
