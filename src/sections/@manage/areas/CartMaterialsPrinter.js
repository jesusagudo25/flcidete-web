import React from 'react';
import {
  Stack, Typography,
  TableRow,
  TableCell,
  Button,
  FormHelperText,
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../../components/iconify';

const CartMaterialsPrinter = ({ materials, deleteMaterialPrinter, updateItemMaterialPrinter }) => {
    return (
        materials ? 
              <>
                <TableRow >
                  <TableCell>
                    <Typography variant="subtitle2" noWrap>
                      {materials.name}
                    </Typography>
                  </TableCell>
                  <TableCell >{materials.sale_price}</TableCell>
                  <TableCell>{materials.area}</TableCell>
                  <TableCell>
                    <Button variant="contained"
                      color="error" onClick={
                        () => {
                          deleteMaterialPrinter(materials.id);
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
                          value={materials.width}
                          onChange={(e) => {
                            materials.width = parseFloat(e.target.value);
                            updateItemMaterialPrinter();
                          }}
                          inputProps={{ min: 1 }}
                          onBlur={(e) => {
                            if (e.target.value < 1) {
                              e.target.value = 1;
                              materials.width = 1;

                            }
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
                          value={materials.height}
                          onChange={(e) => {
                            materials.height = parseFloat(e.target.value);
                            updateItemMaterialPrinter();
                          }}
                          inputProps={{ min: 1 }}
                          onBlur={(e) => {
                            if (e.target.value < 1) {
                              e.target.value = 1;
                              materials.height = 1;
                              updateItemMaterialPrinter();
                            }
                          }}
                        />
                      </FormControl>
                    </Stack>
                  </TableCell>
                </TableRow>
              </>
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
    )
    
}

export default CartMaterialsPrinter