import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = '/api/v1'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
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
      query: () => '/channels',
    }),

    createChannel: builder.mutation({
      query: (newChannel) => ({
        url: '/channels',
        method: 'POST',
        body: newChannel,
      }),
    }),

    editChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
    }),

    deleteChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
    }),

    getMessages: builder.query({
      query: () => '/messages',
    }),
    createMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => '/users/me',
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
