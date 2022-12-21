import React from 'react';
import {
    Stack, Typography,
    TableRow,
    TableCell,
    Button,
    TextField,
    Box,
  } from '@mui/material';
import Iconify from '../../../components/iconify';

const CartMaterialsMillings = ({materials, deleteMaterialMilling, updateItemMilling}) => {
  return (
    materials ?
        materials.length > 0 ?
            materials.map((material) => (
                <TableRow key={material.id}>
                    <TableCell>
                        <Typography variant="subtitle2" noWrap>
                            {material.name}
                        </Typography>
                    </TableCell>
                    <TableCell >
                        <Stack direction="row" alignItems="center" spacing={1}>
                        <TextField
                            type="number"
                            sx={{ width: '50%' }}
                            size="small"
                            onChange={(e) => {
                                if (e.target.value > material.stock) {
                                    e.target.value = material.stock;
                                }
                                material.quantity = parseInt(e.target.value, 10);
                                updateItemMilling();
                            }}
                            value={material.quantity}
                        />
                        <Typography variant="subtitle2" noWrap>
                             / {material.stock}
                        </Typography>
                        </Stack>
                    </TableCell>
                    <TableCell>{material.sale_price}</TableCell>
                    <TableCell>
                        <Button variant="contained"
                            color="error" onClick={
                                () => {
                                    deleteMaterialMilling(material.id);
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
                        No hay materiales en el carrito
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
                    No hay materiales en el carrito
                </Typography>
            </TableCell>
        </TableRow>
);
}

export default CartMaterialsMillings