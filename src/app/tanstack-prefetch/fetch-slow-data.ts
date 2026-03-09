export type SlowDataItem = {
  id: number;
  name: string;
  value: string;
  timestamp: string;
  description: string;
};

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
}

export async function fetchSlowData(
  count: number,
  delayMs: number,
  label: string
): Promise<SlowDataItem[]> {
  const params = new URLSearchParams({
    count: String(count),
    delayMs: String(delayMs),
    label,
  });
  const res = await fetch(`${getBaseUrl()}/api/slow-data?${params}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch slow data: ${res.statusText}`);
  return res.json();
}
