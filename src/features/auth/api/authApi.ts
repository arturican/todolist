import type { LoginInputs } from '@/features/auth/lib';
import { instance } from '@/common/instance/instance.ts';
import type { BaseResponse } from '@/common/types/types.ts';

export const authApi = {
  login(payload: LoginInputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>(
      '/auth/login',
      payload,
    );
  },
};
