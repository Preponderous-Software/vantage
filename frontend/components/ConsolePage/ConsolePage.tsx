import React, { useEffect, useMemo, useState } from 'react';
import { useBrand } from '../../hooks/useBrand';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Paper, Skeleton } from '@mui/material';
import { ServerLog } from '../ServerLog';

export const ConsolePage: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const token = useMemo(() => session?.user?.token, [session]);
  const { brand } = useBrand(token);

  return (
    <>
      <Head>
        {brand ? <title>Console - {brand.serverName}</title> : <title>Console</title>}
      </Head>
      <Paper elevation={1} sx={{
        width: 'calc(100% - 2rem)',
        ml: 'auto',
        mr: 'auto',
        mt: '1rem',
        padding: '1rem'
      }}>
        {token
          ? <ServerLog token={token} wsBaseUrl={process.env.NEXT_PUBLIC_VANTAGE_WEBSOCKET_URL} />
          : <Skeleton
            variant='rectangular'
            sx={{
              width: 'calc(100% - 2rem)',
              ml: 'auto',
              mr: 'auto',
              mt: '1rem',
              padding: '1rem'
            }}
          />
        }
      </Paper>
    </>
  );
}