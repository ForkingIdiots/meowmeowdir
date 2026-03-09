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
          <Title level={2}>TanStack Query + Server Prefetch (Non-Awaited)</Title>
          <Text type="secondary">
            Prefetches are fired on the server but NOT awaited. The pending promises are
            dehydrated and passed to the client, where each useSuspenseQuery suspends
            independently inside its own Suspense boundary. Sections stream in as they resolve.
          </Text>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm">
          <h3 className="font-semibold text-blue-800 mb-2">
            Prefetch vs Streaming: Key Differences
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-700">
            <li>
              <strong>Awaited prefetch:</strong> <code>await Promise.all([prefetchQuery(...)])</code> —
              blocks until all queries finish, sends everything at once.
            </li>
            <li>
              <strong>Non-awaited prefetch (this page):</strong> <code>void prefetchQuery(...)</code> —
              starts fetches on the server, dehydrates pending promises, client suspends per-section.
            </li>
            <li>
              <strong>Result:</strong> Each section streams in independently as its query resolves.
              Fast (0.5s) → Medium (2s) → Slow (5s) → Very Slow (10s). Same progressive UX as
              server-side Suspense streaming, but with TanStack Query cache + refetch on the client.
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

  // Start prefetches WITHOUT awaiting — promises are passed to the client
  // Each useSuspenseQuery on the client will suspend until its query resolves
  void queryClient.prefetchQuery({
    queryKey: slowDataKeys.section("fast"),
    queryFn: () => fetchSlowData(10, 500, "Fast"),
  });
  void queryClient.prefetchQuery({
    queryKey: slowDataKeys.section("medium"),
    queryFn: () => fetchSlowData(50, 2000, "Medium"),
  });
  void queryClient.prefetchQuery({
    queryKey: slowDataKeys.section("slow"),
    queryFn: () => fetchSlowData(100, 5000, "Slow"),
  });
  void queryClient.prefetchQuery({
    queryKey: slowDataKeys.section("very-slow"),
    queryFn: () => fetchSlowData(150, 10000, "Very Slow"),
  });

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
