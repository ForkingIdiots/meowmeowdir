export const slowDataKeys = {
  all: ["slow-data"] as const,
  section: (label: string) => [...slowDataKeys.all, label] as const,
};
