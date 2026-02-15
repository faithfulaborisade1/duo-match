'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
}

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M16.667 5L7.5 14.167L3.333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 7V10.5M10 13.5H10.008M8.615 3.892L1.89 15.098C1.36 16.013 2.025 17.167 3.085 17.167H16.915C17.975 17.167 18.64 16.013 18.11 15.098L11.385 3.892C10.855 2.977 9.145 2.977 8.615 3.892Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 10V14M10 6.5H10.008M18 10C18 14.418 14.418 18 10 18C5.582 18 2 14.418 2 10C2 5.582 5.582 2 10 2C14.418 2 18 5.582 18 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const toastStyles: Record<ToastType, string> = {
  success: 'border-success-200 bg-success-50 text-success-800 dark:border-success-800 dark:bg-success-950/50 dark:text-success-200',
  error: 'border-error-200 bg-error-50 text-error-800 dark:border-error-800 dark:bg-error-950/50 dark:text-error-200',
  warning: 'border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-800 dark:bg-warning-950/50 dark:text-warning-200',
  info: 'border-info-200 bg-info-50 text-info-800 dark:border-info-800 dark:bg-info-950/50 dark:text-info-200',
};

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    if (toast.duration === 0) return;

    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 200);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  return (
    <div
      role="alert"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg',
        'transition-all duration-200',
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0 animate-in slide-in-from-right-full',
        toastStyles[toast.type]
      )}
    >
      <span className="shrink-0 mt-0.5">{toastIcons[toast.type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm opacity-80">{toast.message}</p>
        )}
      </div>
      {toast.dismissible !== false && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            'shrink-0 rounded-md p-1 opacity-60 transition-opacity hover:opacity-100',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
          )}
          aria-label="Dismiss notification"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

type ToastContextType = {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastContext = React.createContext<ToastContextType | null>(null);

let toastCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = React.useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = React.useMemo(
    () => ({ toasts, addToast, removeToast, clearToasts }),
    [toasts, addToast, removeToast, clearToasts]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const toast = React.useMemo(
    () => ({
      success: (title: string, message?: string) =>
        context.addToast({ type: 'success', title, message }),
      error: (title: string, message?: string) =>
        context.addToast({ type: 'error', title, message }),
      warning: (title: string, message?: string) =>
        context.addToast({ type: 'warning', title, message }),
      info: (title: string, message?: string) =>
        context.addToast({ type: 'info', title, message }),
      custom: (data: Omit<ToastData, 'id'>) => context.addToast(data),
      dismiss: (id: string) => context.removeToast(id),
      clearAll: () => context.clearToasts(),
    }),
    [context]
  );

  return toast;
}
