import { AppRouter } from "@teejay/api";
import {
  createTRPCProxyClient,
  createTRPCReact,
  inferRouterProxyClient,
} from "@trpc/react";
import { GetServerSidePropsContext } from "next";
import { createContext, useContext } from "react";
import superjson from "superjson";

import { extractAccessToken } from ".";

export const trpc = createTRPCReact<AppRouter>();

const url = (process.env.NEXT_PUBLIC_API_HOSTNAME ?? "") + "/trpc";
const transformer = superjson;
const clientSideHeaders = () => {
  const cookie = typeof window !== "undefined" ? document.cookie : undefined;
  const token = extractAccessToken(cookie);
  return { Authorization: token && "Bearer " + token };
};

export function createReactSideTRPC() {
  return trpc.createClient({
    url,
    transformer,
    headers: clientSideHeaders,
  });
}

export function createClientSideTRPC() {
  return createTRPCProxyClient<AppRouter>({
    url,
    transformer,
    headers: clientSideHeaders,
  });
}

export function createServerSideTRPC(context: GetServerSidePropsContext) {
  return createTRPCProxyClient<AppRouter>({
    url,
    transformer,
    headers() {
      const token = extractAccessToken(context.req.headers.cookie);
      return { Authorization: token && "Bearer " + token };
    },
  });
}

export type ClientSideTRPC = inferRouterProxyClient<AppRouter>;

export const clientSideTRPC = createClientSideTRPC();

export const useClientSideTRPC = () => {
  return clientSideTRPC;
};
