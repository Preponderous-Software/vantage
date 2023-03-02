import { Chip } from '@mui/material';
import React from 'react';

export function statusToChip(status: string) {
  let label: string = 'Unknown';
  let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';
  switch (status) {
    case 'ACTIVE':
      label = 'Active';
      color = 'success';
      break;
    case 'INACTIVE':
      label = 'Inactive';
      color = 'error';
      break;
  }
  return (
    <Chip
      label={label}
      color={color}
    />
  );
}