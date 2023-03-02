import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useBrand } from '../../hooks/useBrand';
import { useSession } from 'next-auth/react';
import { Paper, Skeleton } from '@mui/material';
import { AuditItemTable } from '../AuditItemTable';

export const AuditPage: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const token = useMemo(() => session?.user?.token, [session]);
  const { brand } = useBrand(token);

  return (
    <>
      <Head>
        {brand ? <title>Audit - {brand.serverName}</title> : <title>Audit</title>}
      </Head>
      <Paper elevation={1} sx={{
        width: 'calc(100% - 2rem)',
        ml: 'auto',
        mr: 'auto',
        mt: '1rem',
        padding: '1rem'
      }}>
        {token
          ? <AuditItemTable token={token} />
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