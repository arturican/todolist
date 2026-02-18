import {
  type BaseResponse,
  type FieldError,
  ResultCode,
} from '../types/api.js';

export const createSuccessResponse = <T>(data: T): BaseResponse<T> => ({
  data,
  resultCode: ResultCode.Success,
  messages: [],
  fieldsErrors: [],
});

export const createEmptySuccessResponse = (): BaseResponse => ({
  data: {},
  resultCode: ResultCode.Success,
  messages: [],
  fieldsErrors: [],
});

export const createErrorResponse = (
  message: string,
  fieldsErrors: FieldError[] = [],
): BaseResponse => ({
  data: {},
  resultCode: ResultCode.Error,
  messages: [message],
  fieldsErrors,
});
