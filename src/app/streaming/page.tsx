import { Flex } from "@/components/Flex";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Suspense } from "react";

// Force dynamic rendering so streaming actually works
export const dynamic = "force-dynamic";

// Simulate slow data fetch with configurable delay
async function fetchSlowData(count: number, delayMs: number, label: string) {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${label} Item ${i + 1}`,
    value: Math.random().toFixed(4),
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    description: `This is a description for item ${i + 1} in the ${label} section. It contains some text to increase payload size.`,
  }));
}

// ---- Streaming Components ----

async function FastSection() {
  const data = await fetchSlowData(10, 500, "Fast");
  return (
    <StreamSection
      title="Fast Section (500ms delay, 10 items)"
      data={data}
      color="green"
    />
  );
}

async function MediumSection() {
  const data = await fetchSlowData(50, 2000, "Medium");
  return (
    <StreamSection
      title="Medium Section (2s delay, 50 items)"
      data={data}
      color="yellow"
    />
  );
}

async function SlowSection() {
  const data = await fetchSlowData(100, 5000, "Slow");
  return (
    <StreamSection
      title="Slow Section (5s delay, 100 items)"
      data={data}
      color="orange"
    />
  );
}

async function VerySlowSection() {
  const data = await fetchSlowData(150, 10000, "Very Slow");
  return (
    <StreamSection
      title="Very Slow Section (10s delay, 150 items)"
      data={data}
      color="red"
    />
  );
}

// ---- Shared UI ----

function StreamSection({
  title,
  data,
  color,
}: {
  title: string;
  data: { id: number; name: string; value: string; timestamp: string; description: string }[];
  color: string;
}) {
  const colorMap: Record<string, string> = {
    green: "border-green-500 bg-green-50",
    yellow: "border-yellow-500 bg-yellow-50",
    orange: "border-orange-500 bg-orange-50",
    red: "border-red-500 bg-red-50",
  };

  return (
    <div className={`border-2 rounded-2xl p-4 ${colorMap[color] ?? "border-gray-300"}`}>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">
        Loaded {data.length} items &middot; Rendered at {new Date().toLocaleTimeString()}
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
            {data.map((item) => (
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
      <p className="text-sm text-gray-400">{label} &mdash; Loading...</p>
      <div className="mt-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

// ---- Page ----

export default function StreamingPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <Flex gap={16} vertical>
        <div>
          <Title level={2}>Next.js Streaming Demo</Title>
          <Text type="secondary">
            Each section below is wrapped in its own Suspense boundary and streams independently.
            Watch them appear one by one as their data resolves.
          </Text>
        </div>

        {/* Info box about AWS limitations */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm">
          <h3 className="font-semibold text-blue-800 mb-2">Streaming + AWS: What to know</h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-700">
            <li><strong>Lambda timeout:</strong> AWS Lambda has a max timeout (default 10s on Vercel, 30s on custom). The Very Slow section (10s) may hit this.</li>
            <li><strong>Response size:</strong> Lambda response payload is capped at ~6MB. 150+ items with descriptions can push towards this.</li>
            <li><strong>Streaming support:</strong> Lambda response streaming requires Lambda Web Adapter or Function URLs. API Gateway (REST) does NOT support streaming — it buffers the entire response.</li>
            <li><strong>CloudFront buffering:</strong> CloudFront may buffer chunked responses, negating the streaming UX.</li>
            <li><strong>Cold starts:</strong> Lambda cold starts add latency before streaming even begins.</li>
          </ul>
        </div>

        {/* All sections stream independently thanks to individual Suspense boundaries */}
        <Suspense fallback={<SectionSkeleton label="Fast Section" />}>
          <FastSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Medium Section" />}>
          <MediumSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Slow Section" />}>
          <SlowSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton label="Very Slow Section" />}>
          <VerySlowSection />
        </Suspense>

        {/* Sequential waterfall demo */}
        <div className="border-t pt-6 mt-4">
          <Title level={3}>Waterfall Demo (No Streaming)</Title>
          <Text type="secondary">
            This section fetches everything sequentially in a single server component — no individual Suspense boundaries.
            The entire block appears at once after all data loads.
          </Text>
        </div>

        <Suspense fallback={<SectionSkeleton label="All waterfall data (will take ~17.5s total)" />}>
          <WaterfallSection />
        </Suspense>
      </Flex>
    </div>
  );
}

async function WaterfallSection() {
  // Sequential fetches — each waits for the previous one
  const fast = await fetchSlowData(10, 500, "WF-Fast");
  const medium = await fetchSlowData(50, 2000, "WF-Medium");
  const slow = await fetchSlowData(100, 5000, "WF-Slow");
  const verySlow = await fetchSlowData(150, 10000, "WF-Very-Slow");

  const total = fast.length + medium.length + slow.length + verySlow.length;

  return (
    <div className="border-2 border-purple-500 bg-purple-50 rounded-2xl p-4">
      <h3 className="font-semibold text-lg mb-2">
        Waterfall Result ({total} items total)
      </h3>
      <p className="text-sm text-gray-600">
        All {total} items loaded sequentially. Total wait: ~17.5s. Rendered at{" "}
        {new Date().toLocaleTimeString()}
      </p>
      <p className="text-sm text-purple-700 mt-2 font-medium">
        On AWS Lambda, this would likely timeout with default settings (10-30s).
        This is why streaming with individual Suspense boundaries is better — users see content progressively.
      </p>
    </div>
  );
}
