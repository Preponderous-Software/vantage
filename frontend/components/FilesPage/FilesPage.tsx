import React, { useMemo, useState } from 'react';
import { useBrand } from '../../hooks/useBrand';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { Paper, Skeleton, Typography } from '@mui/material';
import { useFiles } from '../../hooks/useFiles';
import { FileBrowser } from '../FileBrowser/FileBrowser';

export const FilesPage: React.FC = () => {
  const { data: session } = useSession({ required: true });
  const token = useMemo(() => session?.user?.token, [session]);
  const { brand } = useBrand(token);

  return (
    <>
      <Head>
        {brand ? <title>Files - {brand.serverName}</title> : <title>Files</title>}
      </Head>
      <Paper elevation={1} sx={{
        width: 'calc(100% - 2rem)',
        ml: 'auto',
        mr: 'auto',
        mt: '1rem',
        padding: '1rem'
      }}>
        {token
          ? <FileBrowser token={token} />
          : <Skeleton variant='rectangular' />
        }
      </Paper>
    </>
  );
}