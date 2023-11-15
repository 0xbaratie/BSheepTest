import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  base,
  baseGoerli,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Head from 'next/head'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    base,
    baseGoerli,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [baseGoerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'bsheep',
  projectId: '8c038d5f393301be234998ee77eab910',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Head>
          <title>BSheep</title>
          <meta property='og:title' content='BSheep - Are you 1337?' />
          <meta
            property='og:description'
            content='BSheep is a fully onchain number game for only Farcaster users.'
          />
          <meta property='og:image' content='/ogp.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='apple-touch-icon' sizes='200x200' href='/apple-touch-icon.png' />
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:title' content='BSheep - Are you 1337?' />
          <meta
            name='twitter:description'
            content='BSheep is a fully onchain number game for only Farcaster users.'
          />
          <meta
            name='twitter:image'
            content='https://bsheep.vercel.app/ogp.png'
          />
        </Head>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
