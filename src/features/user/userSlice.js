import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { showToastMessage } from '../common/uiSlice';
import api from '../../utils/api';

export const loginWithEmail = createAsyncThunk(
  'user/loginWithEmail',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      sessionStorage.setItem('token', res.data.token);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'user/loginWithGoogle',
  async (token, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/google', { token });
      if(res.status !== 200) {
        throw new Error('구글 로그인에 실패하였습니다.');
      }
      sessionStorage.setItem('token', res.data.token);
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

export const logout = () => (dispatch) => {
  sessionStorage.removeItem('token');
  dispatch(userSlice.actions.logout());
};
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await api.post('/user', { email, name, password });
      dispatch(
        showToastMessage({
          message: '회원가입을 성공하였습니다.',
          status: 'success',
        })
      );
      navigate('/login');
      return res.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: '회원가입에 실패하였습니다',
          status: 'error',
        })
      );
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  'user/loginWithToken',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/user/me');
      return res.data;
    } catch (error) {
      return rejectWithValue(error.error ?? error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      }).addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      }).addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loginError = null;
      }).addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      });
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
