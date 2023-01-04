import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import { Breadcrumbs, Link, Typography, Container, Stack, Card, Box, Tab, Tabs, FormControl, TextField, IconButton, InputAdornment , Backdrop,
  CircularProgress } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import Iconify from '../components/iconify';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SettingsPage = () => {

  const id = localStorage.getItem('id');
        /* Toastify */
        const showNotification = (type, message) => {
          if (type === 'success') {
            toast.success(message, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          else if (type === 'error') {
            toast.error(message, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          else if (type === 'warning') {
            toast.warn(message, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
          else {
            toast.info(message, {
              position: toast.POSITION.TOP_RIGHT
            });
          }
        };
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  const [value, setValue] = React.useState(0);

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const getAccount = async () => {
    const response = await axios.get(`/api/users/${id}`);
    setIsLoading(false);
    setName(response.data.name);
    setEmail(response.data.email);
  }

  useEffect(() => {
    setIsLoading(true);
    getAccount();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Mi cuenta | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Cuenta
          </Typography>
        </Stack>

        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/dashboard/app">
            Panel de inicio
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="#"
          >
            Usuario
          </Link>
          <Typography color="text.primary">Configuración de cuenta</Typography>
        </Breadcrumbs>

        <Card
          sx={{
            mt: 6,
            mb: 3,
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="General" {...a11yProps(0)} />
              <Tab label="Cambio de contraseña" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Container sx={
              {
                padding: '20px',
              }
            }>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Información general
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-start" mb={2} sx={
                {
                  gap: '10px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Nombre completo
                </Typography>
                <FormControl
                  sx={{ width: '60%' }}
                >
                  <TextField id="outlined-basic" placeholder='Ingrese su nombre completo' variant="outlined" value={name} onChange={
                    (e) => {
                      setName(e.target.value)
                    }
                  } />

                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-start" sx={
                {
                  gap: '10px',
                  mt: '20px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Correo electrónico
                </Typography>
                <FormControl sx={{ width: '60%' }}>
                  <TextField id="outlined-basic" variant="outlined" value={email} onChange={
                    (e) => {
                      setEmail(e.target.value)
                    }
                  } placeholder='Ingrese su correo electrónico' />
                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={
                {
                  mt: '30px',
                }
              }>
                <LoadingButton variant="contained" color="primary" onClick={
                  () => {
                    setIsLoading(true);
                    axios.put(`/api/users/${id}`, {
                      name,
                      email,
                    })
                      .then((response) => {
                        console.log(response);
                        setIsLoading(false);
                        showNotification('success', 'Cambios guardados correctamente');
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                }loading={isLoading}>
                  Guardar cambios
                </LoadingButton>
              </Stack>
            </Container>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Container sx={
              {
                padding: '20px',
              }
            }>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" gutterBottom>
                  Cambio de contraseña
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-start" mb={2} sx={
                {
                  gap: '10px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Contraseña actual
                </Typography>
                <FormControl
                  sx={{ width: '60%' }}
                >
                  <TextField
                    name="password"
                    placeholder='Ingrese su contraseña actual'
                    type={showCurrentPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                            <Iconify icon={showCurrentPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={currentPassword}
                    onChange={
                      (e) => {
                        setCurrentPassword(e.target.value)
                      }
                    }
                  />
                </FormControl>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-start" mb={2} sx={
                {
                  gap: '10px',
                }
              }>
                <Typography variant="body1" gutterBottom>
                  Nueva contraseña
                </Typography>
                <FormControl
                  sx={{ width: '60%' }}
                >
                  <TextField
                    name="password"
                    placeholder="Ingrese su nueva contraseña"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    value={newPassword}
                    onChange={
                      (e) => {
                        setNewPassword(e.target.value)
                      }
                    }
                  />
                </FormControl>
              </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={
                  {
                    mt: '30px',
                  }
                }>
                  <LoadingButton variant="contained" color="primary" onClick={
                    () => {
                      setIsLoading(true);
                      axios.put(`/api/users/${id}/password`, {
                        currentPassword,
                        password: newPassword,
                      })
                        .then((response) => {
                          setCurrentPassword('');
                          setNewPassword('');
                          console.log(response);
                          setIsLoading(false);
                          showNotification('success', 'Cambios guardados correctamente');
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }
                  }
                  loading={isLoading}
                  >
                    Guardar cambios
                  </LoadingButton>
                </Stack>
            </Container>
          </TabPanel>
        </Card>

      </Container>

            {/* Toastify */}

            <ToastContainer />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default SettingsPage