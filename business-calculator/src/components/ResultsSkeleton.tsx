import React from "react";

const ShimmerBar = ({
  width = "100%",
  height = 16,
  className = "",
}: {
  width?: string | number;
  height?: number;
  className?: string;
}) => (
  <div
    className={`shimmer rounded-[6px] ${className}`}
    style={{ width, height }}
  />
);

const SkeletonRow = () => (
  <div className="flex items-center justify-between gap-4 py-3">
    <div className="space-y-1.5">
      <ShimmerBar width={110} height={12} />
      <ShimmerBar width={80} height={9} />
    </div>
    <ShimmerBar width={70} height={20} />
  </div>
);

const SkeletonCard = ({
  rows = 4,
  hero = false,
}: {
  rows?: number;
  hero?: boolean;
}) => (
  <div className="rounded-[25px] bg-[#262626] p-5">
    <ShimmerBar width="35%" height={10} className="mb-4" />
    {hero && (
      <div className="mb-4">
        <ShimmerBar width={140} height={40} className="mb-2" />
        <ShimmerBar width={100} height={9} />
      </div>
    )}
    <div className={`space-y-1 ${hero ? "border-t border-[#333] pt-1" : ""}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  </div>
);

const ResultsSkeleton = () => (
  <div className="space-y-[20px] lg:mt-[56px]">
    <div className="grid gap-[20px] lg:grid-cols-2">
      <SkeletonCard rows={5} hero />
      <SkeletonCard rows={3} />
    </div>
    <div className="grid gap-[20px] lg:grid-cols-2">
      <SkeletonCard rows={4} hero />
      <div className="rounded-[25px] bg-[#262626] p-5">
        <ShimmerBar width="35%" height={10} className="mb-4" />
        <ShimmerBar width="100%" height={100} className="mb-4" />
        <div className="border-t border-[#333] pt-4 space-y-2">
          <ShimmerBar width="90%" height={10} />
          <ShimmerBar width="75%" height={10} />
        </div>
      </div>
    </div>
    <div className="rounded-[25px] bg-[#262626] p-5">
      <ShimmerBar width="30%" height={10} />
    </div>
  </div>
);

export default ResultsSkeleton;
