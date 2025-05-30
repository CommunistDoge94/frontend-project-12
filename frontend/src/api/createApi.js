import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_BASE, apiRoutes } from './apiRoutes'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      
      return headers
    },
  }),
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => apiRoutes.getChannels(),
    }),
    createChannel: builder.mutation({
      query: (newChannel) => ({
        url: apiRoutes.createChannel(),
        method: 'POST',
        body: newChannel,
      }),
    }),
    editChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: apiRoutes.editChannel(id),
        method: 'PATCH',
        body: { name },
      }),
    }),
    deleteChannel: builder.mutation({
      query: (id) => ({
        url: apiRoutes.deleteChannel(id),
        method: 'DELETE',
      }),
    }),
    getMessages: builder.query({
      query: () => apiRoutes.getMessages(),
    }),
    createMessage: builder.mutation({
      query: (message) => ({
        url: apiRoutes.createMessage(),
        method: 'POST',
        body: message,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: apiRoutes.login(),
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: apiRoutes.signup(),
        method: 'POST',
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => apiRoutes.getCurrentUser(),
    }),
  }),
})

export const {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useEditChannelMutation,
  useDeleteChannelMutation,
  useGetMessagesQuery,
  useCreateMessageMutation,
  useLoginMutation,
  useSignupMutation,
  useGetCurrentUserQuery,
} = apiSlice

export default apiSlice
