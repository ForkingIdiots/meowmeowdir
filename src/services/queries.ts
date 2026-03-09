import { queryOptions } from "@tanstack/react-query";
import { getCats, getTags } from "./loader";

export const catQueries = {
  all: () => ["cats"] as const,
  list: (params?: { tags?: string; limit?: number }) =>
    queryOptions({
      queryKey: [...catQueries.all(), "list", params] as const,
      queryFn: async () => {
        const { data } = await getCats({
          limit: params?.limit ?? 100,
          tags: params?.tags,
        });
        return data ?? [];
      },
    }),
};

export const tagQueries = {
  all: () => ["tags"] as const,
  list: () =>
    queryOptions({
      queryKey: [...tagQueries.all(), "list"] as const,
      queryFn: async () => {
        const { data } = await getTags();
        return data ?? [];
      },
    }),
};
