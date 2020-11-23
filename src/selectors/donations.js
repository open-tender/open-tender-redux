export const selectDonation = state => {
  const { success, loading, error, donation } = state.data.donations
  return { success, loading, error, donation }
}
