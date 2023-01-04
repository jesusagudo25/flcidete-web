import React from 'react'
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import { ResetForm } from '../sections/auth/password';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../components/logo';
import Iconify from '../components/iconify';
// sections

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

const ResetPasswordPage = () => {

  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title> Restaurar contraseña | Fab Lab System </title>
      </Helmet>

      <StyledRoot>
        <Logo
          sx={{
            position: 'fixed',
            top: { xs: 16, sm: 24, md: 40 },
            left: { xs: 16, sm: 24, md: 40 },
          }}
        />

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Cuida tus datos...
            </Typography>
            <img src="/assets/illustrations/illustration_forgot.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom align="center" >
              Estás a punto de cambiar tu contraseña
            </Typography>

            <Typography sx={{ color: 'text.secondary' }}
              align="center"
            >
              Al terminar, te enviaremos a iniciar sesión de nuevo con tu nueva contraseña
            </Typography>

            <Divider sx={{ my: 3 }} />

            <ResetForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

export default ResetPasswordPage