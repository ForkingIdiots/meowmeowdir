export type SlowDataItem = {
  id: number;
  name: string;
  value: string;
  timestamp: string;
  description: string;
};

export async function fetchSlowData(
  count: number,
  delayMs: number,
  label: string
): Promise<SlowDataItem[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${label} Item ${i + 1}`,
    value: Math.random().toFixed(4),
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    description: `This is a description for item ${i + 1} in the ${label} section. It contains some text to increase payload size.`,
  }));
}
