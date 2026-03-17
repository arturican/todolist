import type { Dispatch } from '@reduxjs/toolkit';
import { clearDataAC } from '@/common/actions';
import { ResultCode } from '@/common/enums/enums.ts';
import type { BaseResponse } from '@/common/types/types.ts';
import { clearAuthToken } from './authToken.ts';

export const UNAUTHORIZED_MESSAGE = 'You are not authorized';
export const SESSION_EXPIRED_MESSAGE = 'Session expired. Please sign in again.';

export const isUnauthorizedResponse = <T>(data: BaseResponse<T>) => {
  return (
    data.resultCode === ResultCode.Error &&
    data.messages.includes(UNAUTHORIZED_MESSAGE)
  );
};

export const clearClientSession = (dispatch: Dispatch) => {
  clearAuthToken();
  dispatch(clearDataAC());
};
