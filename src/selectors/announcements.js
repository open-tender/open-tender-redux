export const selectAnnouncements = state => state.data.announcements
export const selectAnnouncementsPage = page => state => {
  const { pages, loading, error } = state.data.announcements
  const data = pages ? pages.find(i => i.page === page) : {}
  const { settings = null, entities = [] } = data || {}
  return { settings, entities, loading, error }
}
export const selectHasAnnouncementsPage = page => state => {
  const { pages, loading } = state.data.announcements
  const data = pages ? pages.find(i => i.page === page) : {}
  const { entities = [] } = data || {}
  const hasAnnouncements = entities && entities.length
  return loading === 'pending' || hasAnnouncements ? true : false
}
