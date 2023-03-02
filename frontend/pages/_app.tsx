import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '../src/theme'
import { Layout } from '../components/Layout';
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
}
