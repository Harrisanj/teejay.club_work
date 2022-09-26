import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { enableStaticRendering } from "mobx-react-lite";
import { AppProps } from "next/app";
import { useState } from "react";

import { useScrollRestoration } from "../hooks";
import { RootStoreProvider } from "../stores/root.store";
import {
  InitialData,
  createClientSideTRPC,
  trpc,
  ClientSideTRPCProvider,
  createReactSideTRPC,
} from "../utilities";

import "../styles/globals.css";

enableStaticRendering(typeof window === "undefined");

type Props = Omit<AppProps, "pageProps"> & {
  pageProps: { initialData?: InitialData };
};

function App({ Component, pageProps: { initialData, ...pageProps } }: Props) {
  useScrollRestoration();

  const [queryClient] = useState(() => new QueryClient());
  const [reactSideTRPC] = useState(() => createReactSideTRPC());
  const [clientSideTRPC] = useState(() => createClientSideTRPC());
  return (
    <trpc.Provider client={reactSideTRPC} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ClientSideTRPCProvider value={clientSideTRPC}>
          <RootStoreProvider initialData={initialData}>
            <Component {...pageProps} />
          </RootStoreProvider>
        </ClientSideTRPCProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
