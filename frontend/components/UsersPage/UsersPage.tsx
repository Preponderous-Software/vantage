import React, { useMemo } from 'react';
import { useBrand } from '../../hooks/useBrand';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Paper, Skeleton } from '@mui/material';
import { UsersTable } from '../UsersTable';

export const UsersPage: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const token = useMemo(() => session?.user?.token, [session]);
  const { brand } = useBrand(token);
  return (
    <>
      <Head>
        {brand ? <title>Users - {brand.serverName}</title> : <title>Users</title>}
      </Head>
      <Paper elevation={1} sx={{
        width: 'calc(100% - 2rem)',
        ml: 'auto',
        mr: 'auto',
        mt: '1rem',
        padding: '1rem'
      }}>
        {token
          ? <UsersTable token={token} />
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