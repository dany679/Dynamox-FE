import PersistentDrawerLeft from "@/components/mobile-drawer";

import { webTitle } from "@/utils/constants";
import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
  title: string;
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const headersList = headers();
  const referer = headersList.get("referer");
  const title = headers().get("title");
  return {
    title: ` ${title} | ${webTitle}`,
    icons: {
      icon: "/logo.png",
    },
  };
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-full min-h-full relative ">
      <PersistentDrawerLeft />
      <main className="pt-14 p-4 h-full min-h-full ">{children}</main>
    </div>
  );
}
