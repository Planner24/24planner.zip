import { createSlice } from '@reduxjs/toolkit';

const authPwdSlice = createSlice({
  name: 'authPwd',
  initialState: {
    tempToken: null, // 임시 accessToken
  },
  reducers: {
    setTempToken: (state, action) => {
      state.tempToken = action.payload;
    },
    clearTempToken: (state) => {
      state.tempToken = null;
    },
  },
});

export const { setTempToken, clearTempToken } = authPwdSlice.actions;
export default authPwdSlice.reducer;
