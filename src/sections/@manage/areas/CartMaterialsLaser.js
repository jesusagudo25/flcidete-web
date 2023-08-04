import React from 'react';
import {
  Stack, Typography,
  TableRow,
  TableCell,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../../components/iconify';

const CartMaterialsLaser = ({ materials, deleteMaterialLaser, updateItemLaser }) => {
  return (
    materials ?
      materials.length > 0 ?
        materials.map((material) => (
          <>
            <TableRow >
              <TableCell>
                <Typography variant="subtitle2" noWrap>
                  {material.name}
                </Typography>
              </TableCell>
              <TableCell >$ {material.sale_price}</TableCell>
              <TableCell>{material.area}</TableCell>
              <TableCell>
                <Button variant="contained"
                  color="error" onClick={
                    () => {
                      deleteMaterialLaser(material.id);
                    }
                  }>
                  <Iconify icon="eva:trash-2-fill" />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <FormControl sx={{ width: '50%' }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Ancho</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={<InputAdornment position="start">ft</InputAdornment>}
                      label="Ancho"
                      placeholder='0'
                      size="small"
                      type="number"
                      value={material.width}
                      onChange={(e) => {
                        material.width = parseFloat(e.target.value);
                        updateItemLaser();
                      }}
                    />
                  </FormControl>

                  <FormControl sx={{ width: '50%' }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Alto</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={<InputAdornment position="start">ft</InputAdornment>}
                      label="Alto"
                      placeholder='0'
                      size="small"
                      type="number"
                      value={material.height}
                      onChange={(e) => {
                        material.height = parseFloat(e.target.value);
                        updateItemLaser();
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

export default CartMaterialsLaser