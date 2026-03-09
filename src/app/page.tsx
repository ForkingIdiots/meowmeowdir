import { Flex } from "@/components/Flex";
import { CatsTable } from "@/features/cats-table";
import { HeadingTitle } from "@/features/heading-title";
import { TagsDisplay } from "@/features/tags-display/display";
import { StateParams } from "@/libs/nuqs";
import { NextServerSearchParams } from "@/types";
import { Suspense } from "react";


const CatsTableSkeleton = () => (
  <div className="grid grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => {
      return (
        <div className="col-span-1 aspect-video w-full rounded bg-neutral-200 animate-pulse" key={i} />

      )
    })}
  </div>
)

export default function Home({ searchParams }: { searchParams?: NextServerSearchParams }) {
  const tags = searchParams?.[StateParams.tags]
  const key = Array.isArray(tags) ? tags.join(',') : tags
  return (
    <div className="">
      <Flex gap={8} vertical>
        <HeadingTitle />
        <TagsDisplay />
        <Suspense fallback={<CatsTableSkeleton />} key={key}>
          <CatsTable tags={tags} />
        </Suspense>

      </Flex>
    </div>
  );
}
