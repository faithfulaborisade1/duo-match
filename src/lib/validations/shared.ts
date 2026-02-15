import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export function paginationMeta(page: number, pageSize: number, total: number) {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
    hasMore: page * pageSize < total,
  };
}

export function paginationRange(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}

export function handleSupabaseError(error: { code?: string; message?: string; details?: string }) {
  if (!error) return { status: 500, message: 'Unknown error' };
  switch (error.code) {
    case '23505':
      return { status: 409, message: 'A record with this value already exists' };
    case '23503':
      return { status: 400, message: 'Referenced record does not exist' };
    case 'PGRST116':
      return { status: 404, message: 'Record not found' };
    default:
      return { status: 500, message: error.message || 'Internal server error' };
  }
}

export const uuidSchema = z.string().uuid('Invalid ID format');

export const dateRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
