import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';


const ResetForm = () => {

    /* React Form Hook */

    const { control, handleSubmit, reset, setValue, getValues, formState: { errors }, } = useForm({
        reValidateMode: 'onBlur'
    });

    /* Data */

    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = React.useState('');
    const [passwordConfirm, setPasswordConfirm] = React.useState('');

    const [showPassword, setShowPassword] = useState(false);

    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async (event) => {
        setIsLoading(true)
        axios.post('api/reset-password', {
            token,
            password: event.password,
            password_confirmation: event.passwordConfirm
        })
            .then((response) => {
                setIsLoading(false)
                localStorage.setItem('token', response.data.token)
                localStorage.setItem('id', response.data.id)
                localStorage.setItem('role_id', response.data.role_id)
                navigate('/login', { replace: true });
                setIsLoading(false)
            }).catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
    }

    return (
        <>
            <Stack spacing={3} sx={{ mb: 4 }}>

                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'La contraseña es requerida',
                        minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres'
                        },
                        maxLength: {
                            value: 20,
                            message: 'La contraseña debe tener máximo 20 caracteres'
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
                            message: 'La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un caracter especial'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                        <TextField
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
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                    )}
                />

                <Controller
                    name="passwordConfirm"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Este campo es requerido',
                        validate: (value) => value === getValues('password') || 'Las contraseñas no coinciden'
                    }}
                    render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                        <TextField
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
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                    )}
                />

                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit(handleClick)} loading={isLoading}>
                    Hacer el cambio de contraseña
                </LoadingButton>
            </Stack>
        </>
    )
}

export default ResetForm