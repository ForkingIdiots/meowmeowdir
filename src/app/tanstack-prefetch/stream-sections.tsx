"use client";

import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { slowDataKeys } from "./keys";
import { fetchSlowData, type SlowDataItem } from "./fetch-slow-data";
import { Flex } from "@/components/Flex";
import { Button } from "@/components/Button";
import { Suspense } from "react";

function DataSection({
  queryKey,
  title,
  color,
  count,
  delayMs,
  label,
}: {
  queryKey: readonly string[];
  title: string;
  color: string;
  count: number;
  delayMs: number;
  label: string;
}) {
  const { data, isFetching, dataUpdatedAt, refetch } = useSuspenseQuery<SlowDataItem[]>({
    queryKey,
    queryFn: () => fetchSlowData(count, delayMs, label),
  });

  const colorMap: Record<string, string> = {
    green: "border-green-500 bg-green-50",
    yellow: "border-yellow-500 bg-yellow-50",
    orange: "border-orange-500 bg-orange-50",
    red: "border-red-500 bg-red-50",
  };

  return (
    <div className={`border-2 rounded-2xl p-4 ${colorMap[color] ?? "border-gray-300"}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          {isFetching && (
            <span className="text-xs text-gray-500 animate-pulse">Refetching...</span>
          )}
          <Button size="small" onClick={() => refetch()}>
            Refetch
          </Button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        {data?.length ?? 0} items &middot; Hydrated at{" "}
        {new Date(dataUpdatedAt).toLocaleTimeString()}
      </p>
      <div className="max-h-60 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="text-left p-1">ID</th>
              <th className="text-left p-1">Name</th>
              <th className="text-left p-1">Value</th>
              <th className="text-left p-1">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-1">{item.id}</td>
                <td className="p-1">{item.name}</td>
                <td className="p-1">{item.value}</td>
                <td className="p-1">{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionSkeleton({ label }: { label: string }) {
  return (
    <div className="border-2 border-gray-200 rounded-2xl p-4 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
      <p className="text-sm text-gray-400">{label} — Loading...</p>
      <div className="mt-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export function StreamSections() {
  const queryClient = useQueryClient();

  return (
    <Flex gap={16} vertical>
      <div className="flex justify-end">
        <Button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: slowDataKeys.all })
          }
        >
          Refetch All Sections
        </Button>
      </div>

      <Suspense fallback={<SectionSkeleton label="Fast Section" />}>
        <DataSection
          queryKey={[...slowDataKeys.section("fast")]}
          title="Fast Section (500ms delay, 10 items)"
          color="green"
          count={10}
          delayMs={500}
          label="Fast"
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton label="Medium Section" />}>
        <DataSection
          queryKey={[...slowDataKeys.section("medium")]}
          title="Medium Section (2s delay, 50 items)"
          color="yellow"
          count={50}
          delayMs={2000}
          label="Medium"
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton label="Slow Section" />}>
        <DataSection
          queryKey={[...slowDataKeys.section("slow")]}
          title="Slow Section (5s delay, 100 items)"
          color="orange"
          count={100}
          delayMs={5000}
          label="Slow"
        />
      </Suspense>

      <Suspense fallback={<SectionSkeleton label="Very Slow Section" />}>
        <DataSection
          queryKey={[...slowDataKeys.section("very-slow")]}
          title="Very Slow Section (10s delay, 150 items)"
          color="red"
          count={150}
          delayMs={10000}
          label="Very Slow"
        />
      </Suspense>
    </Flex>
  );
}
