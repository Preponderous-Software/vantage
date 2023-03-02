import React, { useMemo } from 'react';
import { useBrand } from '../../hooks/useBrand';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Paper, Typography } from '@mui/material';

export const HomePage: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const token = useMemo(() => session?.user?.token, [session]);
  const { brand } = useBrand(token);
  return (
    <>
      <Head>
        {brand ? <title>Home - {brand.serverName}</title> : <title>Home</title>}
      </Head>
      <Paper elevation={1} sx={{
        width: 'calc(100% - 2rem)',
        ml: 'auto',
        mr: 'auto',
        mt: '1rem',
        padding: '1rem'
      }}>
        <Typography>Logged in as {session?.user?.username}</Typography>
      </Paper>
    </>
  );
}