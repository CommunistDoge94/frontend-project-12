import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
  name: 'modal',
  initialState: { type: null, extra: {} },
  reducers: {
    openModal: (state, action) => {
      const { type, extra = {} } = action.payload
      state.type = type
      state.extra = extra
    },
    closeModal: (state) => {
      state.type = null
      state.extra = {}
    },
  },
})

export const { openModal, closeModal } = modalSlice.actions
export default modalSlice.reducer
