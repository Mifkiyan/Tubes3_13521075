import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  client: {
    chosenOption: "KMP"
  }
}

export const ReducerSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    optionChangeAction: (state, action) => {
      state.client.chosenOption = action.payload
    }
  }
});

export const { optionChangeAction } = ReducerSlice.actions
export default ReducerSlice.reducer