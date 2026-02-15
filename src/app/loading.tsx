import { Spinner } from '@/components/ui/Spinner';

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading duomatch...</p>
      </div>
    </div>
  );
}
