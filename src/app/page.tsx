import { Flex } from "@/components/Flex";
import { Title } from "@/components/Title";
import { CatsTable } from "@/features/cats-table";
import { HeadingTitle } from "@/features/heading-title";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <HeadingTitle />
      <CatsTable />
    </div>
  );
}
