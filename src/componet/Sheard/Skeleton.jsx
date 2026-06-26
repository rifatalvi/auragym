// Simple Skeleton component - no external library needed
// Use like: <Skeleton className="h-4 w-full" />

export function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-white/[0.06] ${className}`}
      {...props}
    />
  );
}

// Pre-built skeleton blocks for common layouts

// Table row skeleton (for admin tables)
export function TableRowSkeleton({ cols = 3 }) {
  const widths = ["w-1/3", "w-1/4", "w-1/5", "w-1/6", "w-1/4", "w-1/5"];
  return (
    <tr className="border-b border-gray-100 dark:border-white/5">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          {i === 0 ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ) : (
            <Skeleton className={`h-3.5 ${widths[i] || "w-1/4"}`} />
          )}
        </td>
      ))}
    </tr>
  );
}

// Card skeleton (for class/forum cards)
export function CardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#0e1117] border border-gray-200/80 dark:border-white/[0.06]">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="pt-2 flex justify-between items-center">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-1/3 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Forum post list skeleton
export function ForumPostSkeleton() {
  return (
    <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <div className="flex gap-4 shrink-0">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-4 w-10" />
      </div>
    </div>
  );
}

// Stat card skeleton (for dashboards)
export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08]">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

// Forum post manage row skeleton
export function ForumManageRowSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-white/5">
      <td className="px-6 py-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-14 w-20 rounded-lg shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24 mb-1" />
        <Skeleton className="h-3 w-32" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-end">
          <Skeleton className="h-7 w-20 rounded-xl" />
        </div>
      </td>
    </tr>
  );
}
