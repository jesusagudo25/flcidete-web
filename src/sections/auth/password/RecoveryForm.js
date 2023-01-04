import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Controller, useForm } from "react-hook-form";
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const RecoveryForm = ({ setSuccess, email, setEmail }) => {

  /* React Form Hook */

  const { control, handleSubmit, reset, setValue, getValues, formState: { errors }, } = useForm({
    reValidateMode: 'onBlur'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (event) => {
    setIsLoading(true)
    setEmail(event.email)
    await axios.post('/api/forgot-password', {
      email: event.email
    })
    .then((response) => {
        setIsLoading(false)
        setSuccess(true)
      }).catch((error) => {
        console.log(error)
        setIsLoading(false)
      })
  }

  return (
    <>
      <Stack spacing={3} sx={{ mb: 4 }}>
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
              name="email"
              label="Correo electrónico"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              required
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit(handleClick)} loading={isLoading}>
        Recuperar contraseña
      </LoadingButton>
    </>
  )
}

export default RecoveryForm