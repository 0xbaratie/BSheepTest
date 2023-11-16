import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { base, baseGoerli, optimism, optimismGoerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import Head from "next/head";

import { configureChains } from "wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyWagmiConnector } from "@privy-io/wagmi-connector";

const configureChainsConfig = configureChains(
  [
    base,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [baseGoerli] : []),
  ],
  [publicProvider()]
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        embeddedWallets: {
          createOnLogin: "all-users",
          requireUserPasswordOnCreate: false,
        },
      }}
    >
      <PrivyWagmiConnector wagmiChainsConfig={configureChainsConfig}>
        <Head>
          <title>BSheep</title>
          <meta property="og:title" content="BSheep - Are you 1337?" />
          <meta
            property="og:description"
            content="BSheep is a fully onchain number game for only Farcaster users."
          />
          <meta property="og:image" content="/ogp.png" />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="200x200"
            href="/apple-touch-icon.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="BSheep - Are you 1337?" />
          <meta
            name="twitter:description"
            content="BSheep is a fully onchain number game for only Farcaster users."
          />
          <meta
            name="twitter:image"
            content="https://bsheep.vercel.app/ogp.png"
          />
        </Head>
        <Component {...pageProps} />
      </PrivyWagmiConnector>
    </PrivyProvider>
  );
}

export default MyApp;
