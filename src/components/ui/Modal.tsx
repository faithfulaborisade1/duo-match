'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  showCloseButton?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-[90vw]',
} as const;

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      description,
      children,
      className,
      size = 'md',
      closeOnOverlay = true,
      showCloseButton = true,
    },
    ref
  ) => {
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const previousActiveElement = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
      if (open) {
        previousActiveElement.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';

        const timer = setTimeout(() => {
          dialogRef.current?.focus();
        }, 0);

        return () => clearTimeout(timer);
      } else {
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      }

      return () => {
        document.body.style.overflow = '';
      };
    }, [open]);

    React.useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }

        if (e.key === 'Tab' && dialogRef.current) {
          const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          aria-hidden="true"
          onClick={closeOnOverlay ? onClose : undefined}
        />
        <div
          ref={(node) => {
            (dialogRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          aria-describedby={description ? 'modal-description' : undefined}
          tabIndex={-1}
          className={cn(
            'relative z-50 w-full rounded-xl border border-neutral-200 bg-white shadow-xl',
            'dark:border-neutral-700 dark:bg-neutral-800',
            'animate-in zoom-in-95 fade-in duration-200',
            'focus-visible:outline-none',
            'max-h-[85vh] overflow-y-auto',
            sizeClasses[size],
            className
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between px-6 pt-6 pb-2">
              <div className="flex flex-col gap-1">
                {title && (
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id="modal-description"
                    className="text-sm text-neutral-500 dark:text-neutral-400"
                  >
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className={cn(
                    'ml-4 shrink-0 rounded-lg p-1.5 text-neutral-400 transition-colors',
                    'hover:bg-neutral-100 hover:text-neutral-600',
                    'dark:hover:bg-neutral-700 dark:hover:text-neutral-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
                  )}
                  aria-label="Close dialog"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M15 5L5 15M5 5L15 15"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3 px-6 pb-6 pt-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ModalFooter.displayName = 'ModalFooter';

export { Modal, ModalFooter };
