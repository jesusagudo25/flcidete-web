import React, { useState } from 'react'
import {
    Card, Container, Stack, Typography, FormControl, InputLabel,
    Select,
    MenuItem,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    Box,
    IconButton,
    TextField,
} from '@mui/material';
import Label from '../../../components/label';

import Iconify from '../../../components/iconify';

const CartList = ({ items, setServiceSelected, setServiceSelectedId, setOpenMenu }) => {

    return (
        items.length > 0 ?
            items.map((item) => (
                <TableRow key={item.id}>
                    <TableCell align="left">
                        <Typography variant="subtitle2" noWrap>
                            {item.uuid}
                        </Typography>
                    </TableCell>
                    <TableCell align="left">{item.details.base_cost ? item.details.base_cost : parseFloat(0).toFixed(2)}</TableCell>
                    <TableCell align="left" sx={{
                        fontWeight: '600',
                    }}>{item.details.base_cost ? item.details.base_cost : parseFloat(0).toFixed(2)}</TableCell>
                    <TableCell align="right" width="5%">
                        <IconButton size="large" color="inherit" onClick={(event) => {
                            setServiceSelected(item.name);
                            setServiceSelectedId(item.id);
                            setOpenMenu(event.currentTarget);
                        }}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                        </IconButton>
                    </TableCell>
                </TableRow>
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
                        No hay servicios en el carrito
                    </Typography>
                </TableCell>
            </TableRow>
    )


}

export default CartList