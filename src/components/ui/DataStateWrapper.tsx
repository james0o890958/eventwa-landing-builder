import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileX } from "lucide-react";
import { motion } from "framer-motion";

interface DataStateWrapperProps {
  isLoading: boolean;
  isError?: boolean;
  error?: string | null;
  isEmpty: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  children: React.ReactNode;
}

const DefaultSkeleton = () => (
  <div className="space-y-6 w-full">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 p-2">
            <Skeleton className="h-4 w-1/4 rounded-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DefaultEmptyState = ({ message, icon }: { message?: string, icon?: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="py-20 flex flex-col items-center justify-center text-center"
  >
    <div className="mb-4 text-muted-foreground opacity-50">
      {icon || <FileX className="w-16 h-16" />}
    </div>
    <p className="font-display text-xl font-semibold text-foreground">
      {message || "No results found"}
    </p>
  </motion.div>
);

const DefaultErrorState = ({ error }: { error?: string | null }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="py-20 flex flex-col items-center justify-center text-center"
  >
    <div className="mb-4 text-destructive/80">
      <AlertCircle className="w-16 h-16" />
    </div>
    <p className="font-display text-xl font-semibold text-foreground mb-2">
      Something went wrong
    </p>
    {error && <p className="text-sm text-muted-foreground max-w-md">{error}</p>}
  </motion.div>
);

export function DataStateWrapper({
  isLoading,
  isError,
  error,
  isEmpty,
  loadingComponent,
  emptyComponent,
  errorComponent,
  emptyMessage,
  emptyIcon,
  children,
}: DataStateWrapperProps) {
  if (isLoading) {
    return <>{loadingComponent || <DefaultSkeleton />}</>;
  }

  if (isError) {
    return <>{errorComponent || <DefaultErrorState error={error} />}</>;
  }

  if (isEmpty) {
    return <>{emptyComponent || <DefaultEmptyState message={emptyMessage} icon={emptyIcon} />}</>;
  }

  return <>{children}</>;
}
