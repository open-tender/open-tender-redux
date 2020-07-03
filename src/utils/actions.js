const handleError = err => {
  return err.form ? err : err.detail || err.message
}

export const pending = action => {
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
