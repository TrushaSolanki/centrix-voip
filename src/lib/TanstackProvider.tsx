"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { ReactNode } from "react";

interface TanstackProviderProps {
  children: ReactNode;
}
const TanstackProvider = ({ children }:TanstackProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default TanstackProvider;
