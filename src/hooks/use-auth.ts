'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, setAuthToken, clearAuthToken } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import type {
  User,
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SuccessResponse,
} from '@/types/api';

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => apiGet<User>('/api/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupRequest) => apiPost<SignupResponse>('/api/auth/signup', data),
    onSuccess: (response) => {
      setAuthToken(response.token);
      queryClient.setQueryData(queryKeys.auth.me, response.user);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => apiPost<LoginResponse>('/api/auth/login', data),
    onSuccess: (response) => {
      setAuthToken(response.token);
      queryClient.setQueryData(queryKeys.auth.me, response.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiPost<SuccessResponse>('/api/auth/logout'),
    onSuccess: () => {
      clearAuthToken();
      queryClient.clear();
    },
    onError: () => {
      clearAuthToken();
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      apiPost<SuccessResponse>('/api/auth/forgot-password', data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      apiPost<SuccessResponse>('/api/auth/reset-password', data),
  });
}
