import { clearDataAC } from '@/common/actions';
import { finishAppLoadingAC, startAppLoadingAC } from '@/app/app-slice.ts';
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
          dispatch(startAppLoadingAC());
          const res = await authApi.me();
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(finishAppLoadingAC());
            return {
              isLoggedIn: true,
              name: res.data.data.login || res.data.data.email,
            };
          }

          if (isUnauthorizedResponse(res.data)) {
            clearClientSession(dispatch);
          }

          dispatch(finishAppLoadingAC());
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
          dispatch(startAppLoadingAC());
          const res = await authApi.login(data);
          if (res.data.resultCode === ResultCode.Success) {
            setAuthToken(res.data.data.token);
            dispatch(initializeAppTC());
            dispatch(finishAppLoadingAC());
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
          dispatch(startAppLoadingAC());
          const res = await authApi.logout();
          if (res.data.resultCode === ResultCode.Success) {
            clearAuthToken();
            dispatch(clearDataAC());
            dispatch(finishAppLoadingAC());
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
