export const API_BASE = '/api/v1'

export const apiRoutes = {
  signup: () => '/signup',
  login: () => '/login',

  getChannels: () => '/channels',
  createChannel: () => '/channels',
  editChannel: id => `/channels/${id}`,
  deleteChannel: id => `/channels/${id}`,

  getMessages: () => '/messages',
  createMessage: () => '/messages',
  editMessage: id => `/messages/${id}`,
  deleteMessage: id => `/messages/${id}`,

  getCurrentUser: () => '/users/me',
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
