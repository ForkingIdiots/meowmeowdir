"use client";

import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { key: "/", label: "Cats" },
  { key: "/streaming", label: "Streaming" },
  { key: "/tanstack-prefetch", label: "TanStack Prefetch" },
];

export function NavMenu() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[pathname]}
      items={items}
      onClick={({ key }) => router.push(key)}
      style={{ flex: 1 }}
    />
  );
}
