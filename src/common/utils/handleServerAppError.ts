import type { Dispatch } from '@reduxjs/toolkit';
import {
  finishAppLoadingAC,
  setAppErrorAC,
  setAppStatusAC,
} from '@/app/app-slice';
import type { BaseResponse } from '@/common/types/types.ts';
import {
  clearClientSession,
  isUnauthorizedResponse,
  SESSION_EXPIRED_MESSAGE,
} from './authSession.ts';

export const handleServerAppError = <T>(
  data: BaseResponse<T>,
  dispatch: Dispatch,
) => {
  const isUnauthorized = isUnauthorizedResponse(data);

  if (isUnauthorized) {
    clearClientSession(dispatch);
    dispatch(setAppErrorAC({ error: SESSION_EXPIRED_MESSAGE }));
  } else if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }));
  } else {
    dispatch(setAppErrorAC({ error: 'Some error occurred' }));
  }

  dispatch(setAppStatusAC({ status: 'failed' }));
  dispatch(finishAppLoadingAC());
};
