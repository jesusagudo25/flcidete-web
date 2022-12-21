import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';


const ResetForm = () => {

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');

    const [showPassword, setShowPassword] = useState(false);

    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true)
        axios.post('api/reset-password', {
            token,
            password,
            password_confirmation: passwordConfirm
        })
            .then((response) => {
                setIsLoading(false)
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('id', response.data.id)
                localStorage.setItem('role_id', response.data.role_id)
                navigate('/login', { replace: true });
                setIsLoading(false)
            }
            ).catch((error) => {
                console.log(error)
                setIsLoading(false)
            }
            )
    }

    return (
        <>
            <Stack spacing={3} sx={{ mb: 4 }}>

                <TextField
                    name="password"
                    label="Nueva contraseña"
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

                <TextField
                    name="password"
                    label="Confirmar tu contraseña"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} edge="end">
                                    <Iconify icon={showPasswordConfirm ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={passwordConfirm}
                    onChange={
                        (e) => {
                            setPasswordConfirm(e.target.value)
                        }
                    }
                />

                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={isLoading}>
                    Hacer el cambio de contraseña
                </LoadingButton>
            </Stack>
        </>
    )
}

export default ResetForm