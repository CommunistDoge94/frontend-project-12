const getToken = () => localStorage.getItem('token')


const getAuthHeader = () => {
  const token = getToken()
  return {
    Authorization: `Bearer ${token}`,
  }
}

export { getAuthHeader, getToken }