import type { LoginInputs } from '@/features/auth/lib';
import { instance } from '@/common/instance/instance.ts';
import type { BaseResponse } from '@/common/types/types.ts';

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>(
      '/auth/login',
      {
        email: payload.username,
        password: payload.password,
        rememberMe: payload.rememberMe,
        captcha: payload.captcha,
      },
    );
  },
  logout() {
    return instance.delete<BaseResponse>('/auth/login');
  },
  me() {
    return instance.get<
      BaseResponse<{ id: number; email: string; login: string }>
    >('/auth/me');
  },
};
