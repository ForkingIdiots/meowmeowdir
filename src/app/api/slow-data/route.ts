import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const count = Number(searchParams.get("count") || "10");
  const delayMs = Number(searchParams.get("delayMs") || "1000");
  const label = searchParams.get("label") || "Item";

  // Simulate slow response
  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const data = Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${label} Item ${i + 1}`,
    value: Math.random().toFixed(4),
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    description: `This is a description for item ${i + 1} in the ${label} section. It contains some text to increase payload size.`,
  }));

  return NextResponse.json(data);
}
