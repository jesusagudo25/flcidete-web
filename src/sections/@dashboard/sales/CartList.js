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

const CartList = ({ items, setItems, setServiceSelected, setServiceSelectedId, setOpenMenu, changeQuantity }) => {

    return (
        items.length > 0 ?
            items.map((item) => (
                <TableRow key={item.id}>
                    <TableCell align="left">
                        <Typography variant="subtitle2" sx={{  padding: '3px' }}>
                            <TextField  size="small" label={item.uuid} InputLabelProps={{ shrink: true, }} placeholder="Ingrese la descripción" variant="outlined" value={item.description} multiline sx={{ width: '100%' }} onChange={(event) => { 
                                item.description = event.target.value;
                                setItems([...items]);
                            }} />
                        </Typography>
                    </TableCell>

                    <TableCell align="left" width="20%">
                        <Typography variant="subtitle2" sx={{  padding: '3px' }}>
                            <TextField  size="small" label='Cantidad' InputLabelProps={{ shrink: true, }} placeholder="Cantidad" variant="outlined" value={item.quantity} sx={{ width: '80%' }} onChange={(event) => { 
                                changeQuantity(item, items, setItems, event.target.value);
                            }} />
                        </Typography>
                    </TableCell>

                    <TableCell align="left">
                        <Typography variant="subtitle2" sx={{  padding: '3px' }}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={item.unit}
                                sx={{ width: '100%' }}
                                size='small'
                                onChange={(event)=>{
                                    item.unit = event.target.value
                                    setItems([...items]);
                                }}
                            >
                                <MenuItem value={'u'}>Unidad</MenuItem>
                                <MenuItem value={'m'}>Metros</MenuItem>
                                <MenuItem value={'kg'}>Kilogramos</MenuItem>
                                <MenuItem value={'n/a'}>N/A</MenuItem>
                            </Select>
                        </Typography>
                    </TableCell>


                    <TableCell align="left">{item.details.base_cost ? parseFloat(item.details.base_cost).toFixed(2) : parseFloat(0).toFixed(2)}</TableCell>
                    <TableCell align="left" sx={{
                        fontWeight: '600',
                    }}>{item.total ? parseFloat(item.total).toFixed(2) : parseFloat(0).toFixed(2)}</TableCell>
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