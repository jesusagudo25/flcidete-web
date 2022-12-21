import React from 'react'
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Box } from '@mui/material';
import { RegisterForm } from '../sections/auth/register';
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

// ----------------------------------------------------------------------


const RegisterPage = () => {
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
                            Todo desde un solo lugar
                        </Typography>
                        <img src="/assets/illustrations/illustration_register.png" alt="login" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    {
                        success ?
                            (
                                <StyledContent>
                                    <Stack spacing={3} sx={{ mb: 4 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Iconify icon="mdi:alert-circle-check" color="primary.main" width={80} height={80} />
                                        </Box>
                                        <Typography variant="h4" gutterBottom sx={
                                            {
                                                textAlign: 'center'
                                            }
                                        }>
                                            Necesita la aprobación de un administrador
                                        </Typography>
                                        <Typography variant="body1" sx={
                                            {
                                                textAlign: 'center'
                                            }
                                        }>
                                            Para acceder al sistema necesita permiso de un administrador, se le enviará un correo electrónico a {email} cuando su cuenta sea aprobada.
                                        </Typography>
                                        <Typography variant="body2" sx={
                                            {
                                                textAlign: 'center'
                                            }
                                        }>
                                            ¿Tienes una cuenta de administrador? Inicie sesión <Link variant="subtitle2"
                                                underline="none"
                                                component="a" href="/login"
                                            >aquí</Link>

                                        </Typography>
                                    </Stack>
                                </StyledContent>
                            )
                            :
                            (
                                <StyledContent>
                                    <Typography variant="h4" gutterBottom>
                                        Crear cuenta
                                    </Typography>

                                    <Typography variant="body2">
                                        ¿Ya tienes una cuenta? {''}
                                        <Link variant="subtitle2"
                                            underline="none"
                                            component="a" href="/register"
                                        >Iniciar sesión</Link>
                                    </Typography>

                                    <Divider sx={{ my: 3 }} />

                                    <RegisterForm setSuccess={setSuccess} email={email} setEmail={setEmail} />
                                </StyledContent>
                            )
                    }

                </Container>
            </StyledRoot>
        </>
    );
}

export default RegisterPage