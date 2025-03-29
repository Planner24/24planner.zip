import { createSlice } from '@reduxjs/toolkit';

const authPwdSlice = createSlice({
  name: 'authPwd',
  initialState: {
    tempToken: null, // 임시 accessToken
    expiredAt: null,
  },
  reducers: {
    setTempToken: (state, action) => {
      state.tempToken = action.payload.tempToken;
      state.expiredAt = action.payload.expiredAt;
      localStorage.setItem('tempToken', JSON.stringify(action.payload)); // localStorage에 저장할 때 JSON 형태로 변환 필요
    },
    clearTempToken: (state) => {
      state.tempToken = null;
      state.expiredAt = null;
      localStorage.removeItem('tempToken');
    },
  },
});

export const { setTempToken, clearTempToken } = authPwdSlice.actions;
export default authPwdSlice.reducer;
