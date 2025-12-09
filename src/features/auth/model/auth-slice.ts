import {
  createAppSlice,
  handleServerAppError,
  handleServerNetworkError,
} from '@/common/utils';
import { type LoginInputs } from '@/features/auth/lib';
import { setAppStatusAC } from '@/app/app-slice.ts';
import { authApi } from '@/features/auth/api/authApi.ts';
import { ResultCode } from '@/common/enums/enums.ts';

export const authSlice = createAppSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn,
  },
  reducers: create => ({
    initializeAppTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await authApi.me();
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: 'succeeded' }));
            return { isLoggedIn: true };
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
        },
      },
    ),
    loginTC: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await authApi.login(data);
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: 'succeeded' }));
            localStorage.setItem('token', res.data.data.token);
            return { isLoggedIn: true };
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
        },
      },
    ),
    logoutTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await authApi.logout();
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: 'succeeded' }));
            localStorage.removeItem('token');
            return { isLoggedIn: false };
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(error);
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
        },
      },
    ),
  }),
});

export const { selectIsLoggedIn } = authSlice.selectors;
export const { loginTC, logoutTC, initializeAppTC } = authSlice.actions;
export const authReducer = authSlice.reducer;
