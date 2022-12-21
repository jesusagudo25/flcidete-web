import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    setIsLoading(true)
    axios.get('sanctum/csrf-cookie')
      .then(response => {
        axios.post('api/login', {
          email,
          password
        }).then(response => {
          if (response.data.status === 'success') {
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('id', response.data.id)
            localStorage.setItem('role_id', response.data.role_id)
            navigate('/dashboard', { replace: true });
            setIsLoading(false)
          }
          else {

            setMessage(response.data.message)
            setIsLoading(false)
          }
        }).catch(error => {
          setMessage(error.response.data.message)
          setIsLoading(false)
        })
      });
  }

  return (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Correo electrónico" value={email} onChange={
          (e) => {
            setEmail(e.target.value)
          }
        } />

        <TextField
          name="password"
          label="Contraseña"
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
          value={password}
          onChange={
            (e) => {
              setPassword(e.target.value)
            }
          }
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <FormControlLabel control={
          <Checkbox
            color="primary"
            inputProps={{ 'aria-label': 'checkbox with default color' }}
          />
        } label="Recordarme" />
        <Link variant="subtitle2"
          underline="none"
          component="a" href="/forgot-password"
        >¿Se te olvidó tu contraseña?</Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={isLoading}>
        Iniciar sesión
      </LoadingButton>
    </>
  );
}
