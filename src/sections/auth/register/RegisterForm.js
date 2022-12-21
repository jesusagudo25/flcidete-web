import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm({ setSuccess, email, setEmail}) {
    const navigate = useNavigate();

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

    const handleClick = async () => {
        if (terms) {
            setIsLoading(true)
            axios.get('sanctum/csrf-cookie')
                .then(response => {
                    axios.post('api/register', {
                        name,
                        email,
                        'role_id': roleId,
                        password
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
                <TextField name="name" label="Nombre" value={name} onChange={
                    (e) => {
                        setNmae(e.target.value)
                    }
                } />

                <TextField name="email" label="Correo electrónico" value={email} onChange={
                    (e) => {
                        setEmail(e.target.value)
                    }
                } />

                <FormControl fullWidth>
                    <InputLabel id="rol-select-label">Tipo de rol</InputLabel>
                    <Select
                        labelId="rol-select-label"
                        id="rol-select"
                        value={roleId}
                        label="Tipo de rol"
                        onChange={
                            (e) => {
                                setRoleId(e.target.value)
                            }
                        }
                    >
                        {
                            roles.map((role) => {
                                return (
                                    <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>

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

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2, textDecoration: 'underline' }}>
                <FormControlLabel control={
                    <Checkbox
                        color="primary"
                        inputProps={{ 'aria-label': 'checkbox with default color' }}
                        checked={terms}
                        onChange={
                            (e) => {
                                setTerms(e.target.checked)
                            }
                        }
                    />
                }
                    label="Estoy de acuerdo con los términos y condiciones"
                />
            </Stack>

            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} loading={isLoading}>
                Crear cuenta
            </LoadingButton>
        </>
    );
}
