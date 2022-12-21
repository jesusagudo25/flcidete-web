import React from 'react'
import { Helmet } from 'react-helmet-async';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container, Box } from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

// ----------------------------------------------------------------------

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
export const UserActivationPage = () => {

    const { token } = useParams(); /* Id de usuario */
    const navigate = useNavigate();

    const activateUser = async () => {
        try {
            await axios.put(`/api/users/${token}`, {
                active: true,
            });
        } catch (error) {
            console.log(error);
            navigate('/login');
        }
    }

    React.useEffect(() => {
        activateUser();
    }, []);


    /* Refactorizar - el token es el que va a dar el vencimiento, porque si ya se canjeo el codigo ya no debe poder servir. Entonces ahi esta el punto, enviar un token y que se utilice una vez. */

    return (
        <>
            <Helmet>
                <title> Activación de usuario | Minimal UI </title>
            </Helmet>

            <Container>
                <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                    <Typography variant="h3" paragraph>
                        Usuario activado !
                    </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>
                        La cuenta ha sido activada con éxito. Ahora él usuario puede iniciar sesión.
                    </Typography>

                    <Box
                        component="img"
                        src="/assets/illustrations/illustration_activation.png"
                        sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
                    />

                    <Button to="/" size="large" variant="contained" component={RouterLink}>
                        Ir a Inicio
                    </Button>
                </StyledContent>
            </Container>
        </>
    )
}
