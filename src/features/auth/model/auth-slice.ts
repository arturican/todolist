import {
  createAppSlice,
  handleServerAppError,
  handleServerNetworkError,
} from '@/common/utils';
import { type LoginInputs } from '@/features/auth/lib';
import { setAppStatusAC } from '@/app/app-slice.ts';
import { authApi } from '@/features/auth/api/authApi.ts';
import { ResultCode } from '@/common/enums/enums.ts';
import { clearDataAC } from '@/common/actions';

export const authSlice = createAppSlice({
  name: 'auth',
  initialState: {
    name: '',
    isLoggedIn: false,
  },
  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn,
    selectName: state => state.name,
  },
  reducers: create => ({
    initializeAppTC: create.asyncThunk(
      async (_, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await authApi.me();
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: 'succeeded' }));
            return { isLoggedIn: true, name: res.data.data.email };
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(null);
        }
      },
      {
        fulfilled: (state, action) => {
          state.isLoggedIn = action.payload.isLoggedIn;
          state.name = action.payload.name;
        },
      },
    ),
    loginTC: create.asyncThunk(
      async (data: LoginInputs, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }));
          const res = await authApi.login(data);
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(initializeAppTC());
            dispatch(setAppStatusAC({ status: 'succeeded' }));
            localStorage.setItem('token', res.data.data.token);
            return { isLoggedIn: true };
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(null);
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
            dispatch(clearDataAC());
            return { isLoggedIn: false };
          } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null);
          }
        } catch (error: any) {
          handleServerNetworkError(dispatch, error);
          return rejectWithValue(null);
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

export const { selectIsLoggedIn, selectName } = authSlice.selectors;
export const { loginTC, logoutTC, initializeAppTC } = authSlice.actions;
export const authReducer = authSlice.reducer;
