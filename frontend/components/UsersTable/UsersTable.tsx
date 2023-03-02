import React, { useCallback, useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import Grid from '@mui/system/Unstable_Grid';
import {
  Alert, Button,
  ButtonGroup, Chip,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer, TableFooter,
  TableHead, TablePagination,
  TableRow
} from '@mui/material';
import { User, UserStatus } from '../../src/user';
import { useUserUpdate } from '../../hooks/useUserUpdate';
import { ModifyUserDialog } from '../ModifyUserDialog/ModifyUserDialog';
import { CreateUserDialog } from '../CreateUserDialog';
import { useUserCreate } from '../../hooks/useUserCreate';
import { statusToChip } from '../../src/statusToChip';

type UsersTableProps = {
  token: string;
}

export const UsersTable: React.FC<UsersTableProps> = ({ token }) => {
  const [page, setPage] = useState<number>(0);
  const { users, isLoading: isUsersLoading, isError: isUsersError } = useUsers(token);
  const { updateUser } = useUserUpdate(token);
  const { createUser } = useUserCreate(token);
  const [dialogsOpen, setDialogsOpen] = useState<string[]>([]); // contains user ids for open dialogs
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState<boolean>(false);

  return (
    <Grid container spacing={2}>
      <Grid xs={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
        {isUsersLoading
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
          : isUsersError
            ? <Alert severity='error'>Failed to load audit log.</Alert>
            : <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>ID</strong></TableCell>
                    <TableCell><strong>Username</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.users.map((user: User, index: number) => (
                    <TableRow key={`user_${index}`} >
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{statusToChip(user.status)}</TableCell>
                      <TableCell>
                        <ButtonGroup variant="contained">
                          <Button
                            variant='outlined'
                            onClick={() => setDialogsOpen(prevState => [...prevState, user.id])}
                          >
                            Edit
                          </Button>
                        </ButtonGroup>
                        <ModifyUserDialog
                          open={dialogsOpen.indexOf(user.id) !== -1}
                          setOpen={(open) => {
                            if (open) {
                              setDialogsOpen(prevState => [...prevState, user.id]);
                            } else {
                              setDialogsOpen(prevState => prevState.filter(id => id !== user.id));
                            }
                          }}
                          user={user}
                          updateUser={updateUser}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      count={users.pagination.totalItems}
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
      <Grid xs={12} md={8} mdOffset={2} lg={6} lgOffset={3}>
        <Button
          variant='contained'
          color='success'
          onClick={() => setCreateUserDialogOpen(true)}
        >
          Create
        </Button>
        <CreateUserDialog
          open={createUserDialogOpen}
          setOpen={setCreateUserDialogOpen}
          createUser={createUser}
        />
      </Grid>
    </Grid>
  );
}