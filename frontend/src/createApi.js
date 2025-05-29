import axios from 'axios'
import { toast } from 'react-toastify'
import i18n from '../i18n'

const t = i18n.t.bind(i18n)

const apiClient = axios.create({
  baseURL: '/api/v1',
})

export const postApi = async (url, data, headers = {}) => {
  try {
    const response = await apiClient.post(url, data, { headers })
    return response.data
  } catch (error) {
    console.error(t('errors.api'), error)
    toast.error(t('toast.networkError'))
    throw error
  }
}

export default apiClient