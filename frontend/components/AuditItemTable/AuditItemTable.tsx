import React, { useState } from 'react';
import {
  Alert,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer, TableFooter,
  TableHead, TablePagination,
  TableRow
} from '@mui/material';
import { useAudit } from '../../hooks/useAudit';
import Grid from '@mui/system/Unstable_Grid';
import { AuditItem } from '../../src/audit';

type AuditItemTableProps = {
  token: string;
}

export const AuditItemTable: React.FC<AuditItemTableProps> = ({ token }) => {
  const [page, setPage] = useState<number>(0);
  const { audit, isLoading: isAuditLoading, isError: isAuditError } = useAudit(token, page);

  return (
    <Grid container spacing={2}>
      <Grid xs={12} lg={10} lgOffset={1}>
        {isAuditLoading
          ? <Paper elevation={2}>
              <Skeleton
                variant='rectangular'
                sx={{
                  width: 'calc(100% - 2rem)',
                  ml: 'auto',
                  mr: 'auto',
                  mt: '1rem',
                  padding: '1rem'
                }}
              />
            </Paper>
          : isAuditError
            ? <Alert severity='error'>Failed to load audit log.</Alert>
            : <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Time</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {audit.items.map((auditItem: AuditItem, index: number) => (
                    <TableRow key={`auditItem_${index}`} >
                      <TableCell>{auditItem.user.username}</TableCell>
                      <TableCell>{auditItem.description}</TableCell>
                      <TableCell>{new Date(auditItem.time).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      count={audit.pagination.totalItems}
                      page={page}
                      rowsPerPage={50}
                      onPageChange={(event, page) => setPage(page)}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
        }
      </Grid>
    </Grid>
  );
}