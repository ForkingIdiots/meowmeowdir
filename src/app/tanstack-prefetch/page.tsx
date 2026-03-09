import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Flex } from "@/components/Flex";
import { Suspense } from "react";
import { StreamSections } from "./stream-sections";
import { fetchSlowData } from "./fetch-slow-data";
import { slowDataKeys } from "./keys";

export const dynamic = "force-dynamic";

export default function TanstackPrefetchPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <Flex gap={16} vertical>
        <div>
          <Title level={2}>TanStack Query + Server Prefetch</Title>
          <Text type="secondary">
            Same slow data as the streaming demo, but prefetched on the server using
            TanStack Query. Data is dehydrated and hydrated on the client — no loading
            spinners, instant interactivity, and client-side refetch works after hydration.
          </Text>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm">
          <h3 className="font-semibold text-blue-800 mb-2">
            Prefetch vs Streaming: Key Differences
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-700">
            <li>
              <strong>Streaming (Suspense):</strong> Server sends HTML chunks as each section
              resolves. Progressive UX. But breaks on AWS Amplify (buffered).
            </li>
            <li>
              <strong>Prefetch (TanStack):</strong> Server fetches all data, dehydrates it,
              and sends a single complete HTML response. Works everywhere, but user waits for
              the slowest query.
            </li>
            <li>
              <strong>Prefetch + Suspense (this page):</strong> Wraps the prefetch in a
              Suspense boundary so the shell streams instantly, then the prefetched block
              arrives once all queries resolve. Best of both worlds — but still limited by the
              slowest query within the boundary.
            </li>
          </ul>
        </div>

        {/*
          The entire prefetch block is in a single Suspense boundary.
          The shell (title, info box) streams immediately.
          All 4 queries are prefetched in parallel on the server, then dehydrated together.
        */}
        <Suspense
          fallback={
            <div className="space-y-4">
              {["Fast", "Medium", "Slow", "Very Slow"].map((label) => (
                <SectionSkeleton key={label} label={`${label} Section`} />
              ))}
            </div>
          }
        >
          <PrefetchedSections />
        </Suspense>
      </Flex>
    </div>
  );
}

async function PrefetchedSections() {
  const queryClient = new QueryClient();

  // Prefetch all sections in parallel on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: slowDataKeys.section("fast"),
      queryFn: () => fetchSlowData(10, 500, "Fast"),
    }),
    queryClient.prefetchQuery({
      queryKey: slowDataKeys.section("medium"),
      queryFn: () => fetchSlowData(50, 2000, "Medium"),
    }),
    queryClient.prefetchQuery({
      queryKey: slowDataKeys.section("slow"),
      queryFn: () => fetchSlowData(100, 5000, "Slow"),
    }),
    queryClient.prefetchQuery({
      queryKey: slowDataKeys.section("very-slow"),
      queryFn: () => fetchSlowData(150, 10000, "Very Slow"),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StreamSections />
    </HydrationBoundary>
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
