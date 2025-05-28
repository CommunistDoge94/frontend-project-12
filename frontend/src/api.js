const API_BASE = '/api/v1'

export const apiRoutes = {
  signup: () => `${API_BASE}/signup`,
  login: () => `${API_BASE}/login`,

  getChannels: () => `${API_BASE}/channels`,
  createChannel: () => `${API_BASE}/channels`,
  editChannel: id => `${API_BASE}/channels/${id}`,
  deleteChannel: id => `${API_BASE}/channels/${id}`,

  getMessages: () => `${API_BASE}/messages`,
  createMessage: () => `${API_BASE}/messages`,
  editMessage: id => `${API_BASE}/messages/${id}`,
  deleteMessage: id => `${API_BASE}/messages/${id}`,

  getCurrentUser: () => `${API_BASE}/users/me`,
}

export const socketEvents = {
  newMessage: 'newMessage',
  newChannel: 'newChannel',
  removeChannel: 'removeChannel',
  renameChannel: 'renameChannel',
}

export const buildUrlWithParams = (basePath, params) => {
  const query = new URLSearchParams(params).toString()
  return query ? `${basePath}?${query}` : basePath
}
