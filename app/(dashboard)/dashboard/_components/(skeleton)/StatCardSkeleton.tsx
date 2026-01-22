import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type StatCardSkeletonProps = {
  className?: string;
  showDescription?: boolean;
  showDetail?: boolean;
};

export function StatCardSkeleton({
  className,
  showDescription = true,
  showDetail = true,
}: StatCardSkeletonProps) {
  return (
    <Card className={className}>
      {/* Header */}
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-2">
          {/* Title */}
          <Skeleton className="h-5 w-32" />

          {/* Description */}
          {showDescription && <Skeleton className="h-4 w-48" />}
        </div>

        {/* Icon */}
        <Skeleton className="h-9 w-9 rounded-full" />
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-2">
        {/* Value */}
        <Skeleton className="h-7 w-36" />

        {/* Detail */}
        {showDetail && <Skeleton className="h-4 w-44" />}
      </CardContent>
    </Card>
  );
}
