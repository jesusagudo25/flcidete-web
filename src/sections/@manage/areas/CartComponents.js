import React from 'react';
import {
    Stack, Typography,
    TableRow,
    TableCell,
    Button,
    TextField,
    Box
} from '@mui/material';
import Iconify from '../../../components/iconify';

const CartComponents = ({ components, deleteComponent, updateItemElectronic }) => {
    return (
        components ?
            components.length > 0 ?
                components.map((component) => (
                    <TableRow key={component.id}>
                        <TableCell>
                            <Typography variant="subtitle2" noWrap>
                                {component.name}
                            </Typography>
                        </TableCell>
                        <TableCell >
                            <Stack direction="row" alignItems="center" spacing={1}>
                            <TextField
                                type="number"
                                sx={{ width: '50%' }}
                                size="small"
                                onChange={(e) => {
                                    if (e.target.value > component.stock) {
                                        e.target.value = component.stock;
                                    }
                                    component.quantity = parseInt(e.target.value, 10);
                                    updateItemElectronic();
                                }}
                                value={component.quantity}
                            />
                            <Typography variant="subtitle2" noWrap>
                                 / {component.stock}
                            </Typography>
                            </Stack>
                        </TableCell>
                        <TableCell>$ {component.sale_price}</TableCell>
                        <TableCell>
                            <Button variant="contained"
                                color="error" onClick={
                                    () => {
                                        deleteComponent(component.id);
                                    }
                                }>
                                <Iconify icon="eva:trash-2-fill" />
                            </Button>
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
                            No hay componentes en el carrito
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
                        No hay componentes en el carrito
                    </Typography>
                </TableCell>
            </TableRow>
    );
}

export default CartComponents