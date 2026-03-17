import { type ZodError } from 'zod';
import { type FieldError } from '../types/api.js';

export const zodIssuesToFieldErrors = (error: ZodError): FieldError[] => {
  return error.issues.map(issue => ({
    field: issue.path.join('.') || 'body',
    error: issue.message,
  }));
};
