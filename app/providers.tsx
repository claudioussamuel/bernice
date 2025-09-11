"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create wagmi config with NO connectors - MiniKit handles wallet connection
// This allows blockchain reads/writes to work while letting MiniKit handle wallet UI
const config = createConfig({
  chains: [base],
  connectors: [], // Empty - no wallet connectors, MiniKit provides wallet
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers(props: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config} reconnectOnMount={false}>
        <MiniKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: "auto",
              theme: "mini-app-theme",
              name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
              logo: process.env.NEXT_PUBLIC_ICON_URL,
            },
          }}
        >
          {props.children}
        </MiniKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
