import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from '../Link';
import { signOut, useSession } from 'next-auth/react';
import { useBrand } from '../../hooks/useBrand';

type LayoutProps = {
  children?: ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { data: session } = useSession({ required: true });
  const token = useMemo(() => session?.user?.token, [session]);
  const { brand } = useBrand(token);
  const pages = [
    {
      name: 'Home',
      link: '/'
    },
    {
      name: 'Console',
      link: '/console'
    },
    {
      name: 'Files',
      link: '/files'
    },
    {
      name: 'Audit',
      link: '/audit'
    },
    {
      name: 'Users',
      link: '/users'
    }
  ];
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const handleOpenNavMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  }, []);
  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, []);
  const onLogout = useCallback(async () => {
    await signOut();
  }, []);
  return (
    <>
      <AppBar position='static'>
        <Container maxWidth='xl'>
          <Toolbar disableGutters>
            <Typography
              variant='h6'
              noWrap
              component='a'
              href='/'
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              {brand?.serverName ?? 'Server'}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='Account'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' }
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.name}
                    component={Link}
                    noLinkStyle
                    href={page.link}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign='center'>{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Typography
              variant='h5'
              noWrap
              component='a'
              href=''
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              {brand?.serverName ?? 'Server'}
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  noLinkStyle
                  href={page.link}
                  onClick={handleCloseNavMenu}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Button
                key='Logout'
                onClick={onLogout}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {children}
    </>
  );
}