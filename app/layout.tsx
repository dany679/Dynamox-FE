import { cn } from "@/lib/utils";
import ProviderRedux from "@/providers/redux-provider";
import ProviderToaster from "@/providers/tost-provider";
// import { ClerkProvider } from "@clerk/nextjs";
import ProviderMui from "@/providers/mui-provider";
import { NextAuthProvider } from "@/providers/next-provider";
import { Session, getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { authOptions } from "./api/auth/[...nextauth]/options";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Dynamox",
  // description: "",
  icons: {
    icon: "/logo.png",
  },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="h-full min-h-full">
      <body className={cn("h-full min-h-full ", inter)}>
        <ProviderToaster />
        <NextAuthProvider session={session as Session}>
          <ProviderMui>
            <ProviderRedux>{children}</ProviderRedux>
          </ProviderMui>
        </NextAuthProvider>
      </body>
    </html>
  );
}
