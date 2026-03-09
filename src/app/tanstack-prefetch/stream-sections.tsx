"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { slowDataKeys } from "./keys";
import { fetchSlowData, type SlowDataItem } from "./fetch-slow-data";
import { Flex } from "@/components/Flex";
import { Button } from "@/components/Button";

function DataSection({
  queryKey,
  title,
  color,
}: {
  queryKey: readonly string[];
  title: string;
  color: string;
}) {
  const { data, isFetching, dataUpdatedAt, refetch } = useQuery<SlowDataItem[]>({
    queryKey,
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

      <DataSection
        queryKey={[...slowDataKeys.section("fast")]}
        title="Fast Section (500ms delay, 10 items)"
        color="green"
      />
      <DataSection
        queryKey={[...slowDataKeys.section("medium")]}
        title="Medium Section (2s delay, 50 items)"
        color="yellow"
      />
      <DataSection
        queryKey={[...slowDataKeys.section("slow")]}
        title="Slow Section (5s delay, 100 items)"
        color="orange"
      />
      <DataSection
        queryKey={[...slowDataKeys.section("very-slow")]}
        title="Very Slow Section (10s delay, 150 items)"
        color="red"
      />
    </Flex>
  );
}
