import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton, MenuItem, Select,
  TextField
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { User, UserStatus } from '../../src/user';
import { UserUpdateRequest } from '../../hooks/useUserUpdate'
import Grid from '@mui/system/Unstable_Grid';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import { statusToChip } from '../../src/statusToChip';

export type ModifyUserDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  user: User;
  updateUser: (patch: UserUpdateRequest) => Promise<User>;
}

export const ModifyUserDialog: React.FC<ModifyUserDialogProps> = ({ open, setOpen, user, updateUser }) => {
  const [username, setUsername] = useState<string>(user.username);
  const [password, setPassword] = useState<string>('');
  const [status, setStatus] = useState<UserStatus>(user.status);
  useEffect(() => {
    setUsername(user.username);
    setPassword('');
    setStatus(user.status);
  }, [user]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setUsername(user.username);
    setPassword('');
    setStatus(user.status);
  }, [setOpen, user.username, user.status]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Modify user
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
              onChange={(event) => setUsername(event.target.value)}
              error={username === ''}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              label="Password"
              fullWidth
              type="password"
              margin="dense"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
          <Grid xs={12}>
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value as UserStatus)}
              fullWidth
            >
              <MenuItem value='ACTIVE'>
                {statusToChip('ACTIVE')}
              </MenuItem>
              <MenuItem value='INACTIVE'>
                {statusToChip('INACTIVE')}
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant='contained'
          color='success'
          disabled={username === ''}
          onClick={() => {
            updateUser({
              id: user.id,
              version: user.version,
              username: username,
              password: password === '' ? undefined : password,
              status: status
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