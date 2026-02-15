import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { handleSupabaseError } from '@/lib/validations/shared';

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function createdResponse(data: unknown) {
  return NextResponse.json(data, { status: 201 });
}

export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
}

export function errorResponse(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function validationErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      error: 'Validation error',
      details: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    },
    { status: 400 }
  );
}

export function handleDbError(error: { code?: string; message?: string; details?: string }) {
  const { status, message } = handleSupabaseError(error);
  return errorResponse(message, status);
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message = 'Forbidden') {
  return errorResponse(message, 403);
}

export function notFoundResponse(message = 'Not found') {
  return errorResponse(message, 404);
}
