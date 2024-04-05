"use client";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";
import toast from "react-hot-toast";

export default function ProviderTanStack({ children }: { children: ReactNode }) {
  // const queryClient = new QueryClient();
  // const refresh = async()=>{
  //   const res = await axios.post(
  //     "/auth/refresh",
  //     {},
  //     {
  //       headers: {
  //         Authorization: `Bearer ${session?.user.refreshToken}`,
  //       },
  //     }
  //   );
  // }
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: any, query) => {
            console.log("ERROR PROVIDER");
            console.log(error);
            console.log(query);
            // 🎉 only show error toasts if we already have data in the cache
            // which indicates a failed background update
            const status = error?.response?.status || null;
            const data = error?.response?.data || null;
            console.log({ status, data });
            if (status === 401) {
              // toast.error(`Something went wrong: ${data?.error || ""}`);
            }
            if (status >= 404) {
              toast.error(`Something went wrong: ${data?.error || ""}`);
            }
            //can add axios interceptor hi if need
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
