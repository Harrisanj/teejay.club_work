import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { enableStaticRendering } from "mobx-react-lite";
import { AppProps } from "next/app";
import { useState } from "react";

import { RootStoreProvider } from "../stores/root.store";
import { InitialData, trpc, createReactSideTRPC } from "../utilities";

import "../styles/globals.css";

enableStaticRendering(typeof window === "undefined");

type Props = Omit<AppProps, "pageProps"> & {
  pageProps: { initialData?: InitialData };
};

function App({ Component, pageProps: { initialData, ...pageProps } }: Props) {
  const [queryClient] = useState(() => new QueryClient());
  const [reactSideTRPC] = useState(() => createReactSideTRPC());
  return (
    <trpc.Provider client={reactSideTRPC} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RootStoreProvider initialData={initialData}>
          <Component {...pageProps} />
        </RootStoreProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
