const initState = {
  orderType: null,
  serviceType: null,
}

const ORDER_TYPE = 'order/setOrderType'

export const setOrderType = (orderType) => ({
  type: ORDER_TYPE,
  payload: orderType,
})

export default (state = initState, action) => {
  switch (action.type) {
    case ORDER_TYPE:
      return { ...state, orderType: action.payload }
    default:
      return state
  }
}
