import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const RecoveryForm = ({ setSuccess, email, setEmail }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true)
    await axios.post('/api/forgot-password', {
      email
    })
      .then((response) => {
        setIsLoading(false)
        setSuccess(true)
      }
      ).catch((error) => {
        console.log(error)
        setIsLoading(false)
      }
      )

    /* 
    
    Revisa tu correo y sigue las instrucciones
    Te hemos enviado un correo a chuagudo25@hotmail.com con las instrucciones para cambiar tu contraseña.
    *Si no logras encontrarlo, revisa tu bandeja de spam.
    */
  }

  return (
    <>
      <Stack spacing={3} sx={{ mb: 4 }}>
        <TextField name="email" label="Correo electrónico" value={email} onChange={
          (e) => {
            setEmail(e.target.value)
          }
        } />
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={isLoading}>
        Recuperar contraseña
      </LoadingButton>
    </>
  )
}

export default RecoveryForm