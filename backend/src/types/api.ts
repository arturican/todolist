export type FieldError = {
  error: string;
  field: string;
};

export type BaseResponse<T = Record<string, never>> = {
  data: T;
  resultCode: number;
  messages: string[];
  fieldsErrors: FieldError[];
};

export enum ResultCode {
  Success = 0,
  Error = 1,
  CaptchaError = 10,
}
