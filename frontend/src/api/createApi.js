import axios from 'axios'
import { toast } from 'react-toastify'
import i18n from '../i18n'

const t = i18n.t.bind(i18n)

const apiClient = axios.create()

export const postApi = async (url, data, headers = {}) => {
  try {
    const response = await apiClient.post(`${url}`, data, { headers })
    return response.data
  }
  catch (error) {
    console.error(t('errors.api'), error)
    toast.error(t('toast.networkError'))
    throw error
  }
}

export const deleteApi = async (url, headers = {}) => {
  try {
    const response = await apiClient.delete(`${url}`, { headers })
    return response.data
  }
  catch (error) {
    console.error(t('errors.api'), error)
    toast.error(t('toast.networkError'))
    throw error
  }
}

export const patchApi = async (url, data, headers = {}) => {
  try {
    const response = await apiClient.patch(`${url}`, data, { headers })
    return response.data
  }
  catch (error) {
    console.error(t('errors.api'), error)
    toast.error(t('toast.networkError'))
    throw error
  }
}

export const getApi = async (url, headers = {}) => {
  try {
    const response = await apiClient.get(url, { headers })
    return response.data
  }
  catch (error) {
    console.error(t('errors.api'), error)
    toast.error(t('toast.networkError'))
    throw error
  }
}

export default apiClient
