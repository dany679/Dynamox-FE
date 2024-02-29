import { headers } from "next/headers";

import { webTitle } from "@/utils/constants";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  // read route params
  const headersList = headers();
  // const host = headersList.get("host"); // to get domain
  const url = headersList.get("next-url")?.substring(1) || "login"; //
  return {
    title: `${url} | ${webTitle}`,
    icons: {
      icon: "/logo.png",
    },
  };
}
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex items-center justify-center h-full">{children}</main>;
}
