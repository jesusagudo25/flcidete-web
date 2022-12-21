import React from 'react';
import {
    Stack, Typography,
    TableRow,
    TableCell,
    Button,
    Box,
    FormControl,
    InputLabel,
  } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../../components/iconify';

const CartResins = ({ resins, deleteResin, updateItemResin }) => {
    return (
        resins ?
            resins.length > 0 ?
                resins.map((resin) => (
                    <>
                        <TableRow key={resin.id}>
                            <TableCell>
                                <Typography variant="subtitle2" noWrap>
                                    {resin.name}
                                </Typography>
                            </TableCell>
                            <TableCell>{resin.current_weight}</TableCell>
                            <TableCell>
                                <Button variant="contained"
                                    color="error" onClick={
                                        () => {
                                            deleteResin(resin.id);
                                        }
                                    }>
                                    <Iconify icon="eva:trash-2-fill" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <Stack direction="row" alignItems="center" spacing={1} sx={
                                    {
                                        justifyContent: 'center',
                                    }
                                }>
                                    <FormControl sx={{ width: '50%' }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Cantidad de gramos</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">g</InputAdornment>}
                                            label="Cantidad de gramos"
                                            placeholder='0'
                                            size="small"
                                            type="number"
                                            value={resin.weight}
                                            onChange={(e) => {
                                                resin.weight = parseFloat(e.target.value);
                                                updateItemResin();
                                            }}
                                        />
                                    </FormControl>
                                </Stack>
                            </TableCell>
                        </TableRow>
                    </>

                ))
                :
                <TableRow>
                    <TableCell colSpan={5} align="center">

                        <Box sx={{
                            my: 1,
                        }}>
                            <Iconify icon="mdi:cart-off" color="#2065D1" width={25}
                                sx={{ fontSize: '3rem' }}
                            />
                        </Box>
                        <Typography variant="subtitle1" sx={{ my: 1 }}>
                            No hay resinas en el carrito
                        </Typography>
                    </TableCell>
                </TableRow>
            :
            <TableRow>
                <TableCell colSpan={5} align="center">

                    <Box sx={{
                        my: 1,
                    }}>
                        <Iconify icon="mdi:cart-off" color="#2065D1" width={25}
                            sx={{ fontSize: '3rem' }}
                        />
                    </Box>
                    <Typography variant="subtitle1" sx={{ my: 1 }}>
                        No hay resinas en el carrito
                    </Typography>
                </TableCell>
            </TableRow>
    );
}

export default CartResins