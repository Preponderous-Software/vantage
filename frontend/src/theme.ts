import { createTheme } from '@mui/material';
import { deepPurple } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple[200]
    }
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  }
});