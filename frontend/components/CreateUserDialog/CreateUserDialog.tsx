import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { User } from '../../src/user';
import Grid from '@mui/system/Unstable_Grid';
import { UserCreateRequest } from '../../hooks/useUserCreate';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

export type CreateUserDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  createUser: (user: UserCreateRequest) => Promise<User>;
}

export const CreateUserDialog: React.FC<CreateUserDialogProps> = ({ open, setOpen, createUser }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameModified, setUsernameModified] = useState<boolean>(false);
  const [passwordModified, setPasswordModified] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    setOpen(false);
    setUsername('');
    setUsernameModified(false);
    setPassword('');
    setPasswordModified(false);
  }, [setOpen, setUsername, setPassword]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Create user
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <TextField
              label="Username"
              autoFocus
              fullWidth
              margin="dense"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setUsernameModified(true);
              }}
              error={username === '' && usernameModified}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              label="Password"
              fullWidth
              type="password"
              margin="dense"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordModified(true);
              }}
              error={password === '' && passwordModified}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='success'
          disabled={username === '' || password === ''}
          onClick={() => {
            createUser({
              username: username,
              password: password
            });
            handleClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}