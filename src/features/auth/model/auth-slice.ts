import { clearDataAC } from '@/common/actions';
import { ResultCode } from '@/common/enums/enums.ts';
import {
  clearAuthToken,
  clearClientSession,
  createAppSlice,
  handleServerAppError,
  handleServerNetworkError,
  isUnauthorizedResponse,
  setAuthToken,
} from '@/common/utils';
import { setAppStatusAC } from '@/app/app-slice.ts';
import { authApi } from '@/features/auth/api/authApi.ts';
import { type LoginInputs } from '@/features/auth/lib';

const initialState = {
  name: '',
  isLoggedIn: false,
};

export const authSlice = createAppSlice({
  name: 'auth',
  initialState,
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
            return {
              isLoggedIn: true,
              name: res.data.data.login || res.data.data.email,
            };
          }

          if (isUnauthorizedResponse(res.data)) {
            clearClientSession(dispatch);
          }

          dispatch(setAppStatusAC({ status: 'succeeded' }));
          return { isLoggedIn: false, name: '' };
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
            setAuthToken(res.data.data.token);
            dispatch(initializeAppTC());
            dispatch(setAppStatusAC({ status: 'succeeded' }));
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
            clearAuthToken();
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
          state.name = '';
        },
      },
    ),
  }),
  extraReducers: builder => {
    builder.addCase(clearDataAC, () => ({ ...initialState }));
  },
});

export const { selectIsLoggedIn, selectName } = authSlice.selectors;
export const { loginTC, logoutTC, initializeAppTC } = authSlice.actions;
export const authReducer = authSlice.reducer;
