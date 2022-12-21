import React from 'react'
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button, Box } from '@mui/material';
import { RecoveryForm } from '../sections/auth/password';
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
const ForgotPasswordPage = () => {
  const mdUp = useResponsive('up', 'md');
  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState('');

  return (
    <>
      <Helmet>
        <title> Registro | Fab Lab System </title>
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
          {
            success ?
              <StyledContent>
                <Stack spacing={3} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Iconify icon="ic:twotone-mark-email-read" color="primary.main" width={80} height={80} />
                  </Box>
                  <Typography variant="h4" gutterBottom sx={
                    {
                      textAlign: 'center'
                    }
                  }>
                    Revisa tu correo y sigue las instrucciones
                  </Typography>
                  <Typography variant="body1" sx={
                    {
                      textAlign: 'center'
                    }
                  }>
                    Te hemos enviado un correo a {email} con las instrucciones para cambiar tu contraseña.
                  </Typography>
                  <Typography variant="body2" sx={
                    {
                      textAlign: 'center'
                    }
                  }>
                    *Si no logras encontrarlo, revisa tu bandeja de spam.
                  </Typography>
                </Stack>
              </StyledContent>
              :
              <StyledContent>
                <Typography variant="h4" gutterBottom>
                  Olvidé mi contraseña
                </Typography>

                <Typography variant="body2">
                  ¿Ya tienes una contraseña? {''}
                  <Link variant="subtitle2"
                    underline="none"
                    component="a" href="/login"
                  >Iniciar sesión</Link>
                </Typography>

                <Divider sx={{ my: 3 }} />

                <RecoveryForm setSuccess={setSuccess} email={email} setEmail={setEmail} />
              </StyledContent>
          }

        </Container>
      </StyledRoot>
    </>
  );
}

export default ForgotPasswordPage