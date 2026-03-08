import { Flex } from "@/components/Flex";
import { Title } from "@/components/Title";
import { CatsTable } from "@/features/cats-table";
import { HeadingTitle } from "@/features/heading-title";
import Image from "next/image";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="">
      <HeadingTitle />
      <Suspense fallback='loading'>
        <CatsTable />
      </Suspense>
    </div>
  );
}
