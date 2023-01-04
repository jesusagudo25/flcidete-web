import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Controller, useForm } from "react-hook-form";
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm({ setSuccess, email, setEmail }) {

    /* React Form Hook */

    const { control, handleSubmit, reset, setValue, setError, getValues, clearErrors, watch, formState: { errors }, } = useForm({
        reValidateMode: 'onBlur'
    });

    const watchEmail = watch('email');

    /* Data */

    const [name, setNmae] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [terms, setTerms] = useState(false);

    const [roles, setRoles] = useState([]);

    const getRoles = async () => {
        axios.get('api/roles')
            .then(response => {
                setRoles(response.data)
            }).catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        getRoles()
    }, []);

    useEffect(() => {
        const validate = async () => {
            if (watchEmail !== '') {
                axios.post('api/users/check-email', {
                    email: watchEmail
                }).then(response => {
                    /* clear error */
                    clearErrors('email')
                }).catch(error => {
                    console.log(error.response.data.message);
                    setError('email', {
                        type: 'server',
                        message: 'El correo electrónico ya está registrado'
                    })
                })
            }
        }
        validate()
    }, [watchEmail]);

    const handleClick = async (event) => {
        setEmail(event.email)
        if (event.terms) {
            setIsLoading(true)
            axios.get('sanctum/csrf-cookie')
                .then(response => {
                    axios.post('api/register', {
                        name: event.name,
                        email: event.email,
                        'role_id': event.roleId,
                        password: event.password
                    }).then(response => {
                        if (response.data.status === 'success') {
                            localStorage.setItem('token', response.data.token)
                            localStorage.setItem('id', response.data.id)
                            localStorage.setItem('role_id', response.data.role_id)
                            setIsLoading(false)
                            setSuccess(true)
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
    }

    return (
        <>
            <Stack spacing={3}>
                <Controller
                    name="name"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'El nombre es requerido',
                        minLength: {
                            value: 3,
                            message: 'El nombre debe tener al menos 3 caracteres'
                        },
                        maxLength: {
                            value: 50,
                            message: 'El nombre debe tener máximo 50 caracteres'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                        <TextField
                            label="Nombre"
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                    )}
                />

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
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                    )}
                />

                <FormControl fullWidth error={!!errors?.roleId}>
                    <InputLabel id="rol-select-label">Tipo de rol</InputLabel>
                    <Controller
                        name="roleId"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'El tipo de rol es requerido',
                        }}
                        render={({ field: { onChange, onBlur, value, } }) => (
                            <Select
                                labelId="rol-select-label"
                                id="rol-select"
                                value={value}
                                label="Tipo de rol"
                                onChange={onChange}
                                onBlur={onBlur}
                            >
                                {
                                    roles.map((role) => {
                                        return (
                                            <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        )}
                    />
                    <FormHelperText>{errors?.roleId?.message}</FormHelperText>
                </FormControl>

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
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={!!error}
                            helperText={error ? error.message : null}
                        />
                    )}
                />
            </Stack>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                <FormControl component="fieldset" error={!!errors?.terms}>
                    <FormControlLabel control={
                        <Controller
                            name="terms"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Debe aceptar los términos y condiciones',
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Checkbox
                                    color="primary"
                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                    checked={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                />
                            )}
                        />
                    }
                        label="Estoy de acuerdo con los términos y condiciones"
                    />
                    <FormHelperText>{errors?.terms?.message}</FormHelperText>
                </FormControl>
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmit(handleClick)} loading={isLoading}>
                Crear cuenta
            </LoadingButton>
        </>
    );
}
