import { Flex } from "@/components/Flex";
import { CatsTable } from "@/features/cats-table";
import { HeadingTitle } from "@/features/heading-title";
import { TagsDisplay } from "@/features/tags-display/display";
import { StateParams } from "@/libs/nuqs";
import { NextServerSearchParams } from "@/types";
import { Suspense } from "react";


export default function Home({ searchParams }: { searchParams?: NextServerSearchParams }) {
  const tags = searchParams?.[StateParams.tags]
  console.log('tags', tags)
  return (
    <div className="">
      <Flex gap={8} vertical>
        <HeadingTitle />
        <TagsDisplay />
        <Suspense fallback='loading'>
          <CatsTable tags={tags} />
        </Suspense>

      </Flex>
    </div>
  );
}
