const handleError = (err) => {
  return err.detail || err.message
}

export const fetch = (action) => {
  return { type: `${action}/pending` }
}

export const fulfill = (action, payload) => {
  return {
    type: `${action}/fulfilled`,
    payload: payload,
  }
}

export const reject = (action, err) => {
  return {
    type: `${action}/rejected`,
    payload: handleError(err),
  }
}
