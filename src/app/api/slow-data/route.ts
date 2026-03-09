import { NextRequest, NextResponse } from "next/server";

// Simple seeded PRNG for deterministic values per request
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const count = Number(searchParams.get("count") || "10");
  const delayMs = Number(searchParams.get("delayMs") || "1000");
  const label = searchParams.get("label") || "Item";
  const seed = searchParams.get("seed") || "0";

  // Simulate slow response
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const random = seededRandom(hashString(`${label}-${seed}`));

  const data = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${label} Item ${i + 1}`,
    value: random().toFixed(4),
    timestamp: new Date(1700000000000 - random() * 86400000).toISOString(),
    description: `This is a description for item ${i + 1} in the ${label} section. It contains some text to increase payload size.`,
  }));

  return NextResponse.json(data);
}
