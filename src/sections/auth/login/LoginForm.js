import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Controller, useForm } from "react-hook-form";
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {

  /* React Navigate */

  const navigate = useNavigate();

  /* React Form Hook */

  const { control, handleSubmit, reset, setValue, getValues, setError, clearErrors, formState: { errors }, } = useForm({
    reValidateMode: 'onBlur'
  });

  /* Data */

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(false);

  const handleClick = async (event) => {
    setIsLoading(true)
    axios.get('sanctum/csrf-cookie')
      .then(response => {
        axios.post('api/login', {
          email: event.email,
          password: event.password
        }).then(response => {
          if (response.data.status === 'success') {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('id', response.data.id);
            localStorage.setItem('role_id', response.data.role_id);

            navigate('/dashboard', { replace: true });
            setIsLoading(false)
          }
          else {
            setMessage(response.data.message)
            setIsLoading(false)
          }
        }).catch(error => {
          setError('backend', {
            type: 'manual',
            message: 'Correo electrónico o contraseña incorrectos'
          });
          console.log(error.response.data.message);
          setIsLoading(false)
        })
      });
  }

  return (
    <>
      <Stack spacing={3}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: 'Correo electrónico es requerido',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico no válido'
            }
          }}
          render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
            <TextField
              label="Correo electrónico"
              value={value}
              onChange={
                (e) => {
                  onChange(e.target.value)
                  clearErrors('backend')
                }
              }
              onBlur={onBlur}
              required
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: 'Contraseña es requerida',
          }}
          render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
            <TextField
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
              value={value}
              onChange={
                (e) => {
                  onChange(e.target.value)
                  clearErrors('backend')
                }
              }
              onBlur={onBlur}
              required
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
          <FormHelperText sx={{ color: 'error.main' }}>{errors.backend ? errors.backend.message : ''
        }</FormHelperText>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 2 }}>

        <Link variant="subtitle2"
          underline="none"
          component="a" href="/forgot-password"
        >¿Se te olvidó tu contraseña?</Link>

      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit(handleClick)} loading={isLoading}>
        Iniciar sesión
      </LoadingButton>
    </>
  );
}
