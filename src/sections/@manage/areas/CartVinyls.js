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

const CartVinyls = ({ vinyls, deleteVinyl, updateItemVinyl }) => {
  return (
    vinyls ?
      vinyls.length > 0 ?
        vinyls.map((vinyl) => (
          <>
            <TableRow >
              <TableCell>
                <Typography variant="subtitle2" noWrap>
                  {vinyl.name}
                </Typography>
              </TableCell>
              <TableCell >{vinyl.sale_price}</TableCell>
              <TableCell>{vinyl.area}</TableCell>
              <TableCell>
                <Button variant="contained"
                  color="error" onClick={
                    () => {
                      deleteVinyl(vinyl.id);
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
                      startAdornment={<InputAdornment position="start">in</InputAdornment>}
                      label="Ancho"
                      placeholder='0'
                      size="small"
                      type="number"
                      value={vinyl.width}
                      onChange={(e) => {
                        vinyl.width = parseInt(e.target.value, 10);
                        updateItemVinyl();
                      }}
                      inputProps={{ min: 4 }}
                      onBlur={(e) => {
                        if (e.target.value < 4) {
                          e.target.value = 4;
                          vinyl.width = 4;
                          updateItemVinyl();
                        }
                      }}
                    />
                    <FormHelperText id="outlined-weight-helper-text">Minimo 4</FormHelperText>
                  </FormControl>

                  <FormControl sx={{ width: '50%' }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Alto</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={<InputAdornment position="start">in</InputAdornment>}
                      label="Alto"
                      placeholder='0'
                      size="small"
                      type="number"
                      value={vinyl.height}
                      onChange={(e) => {
                        vinyl.height = parseInt(e.target.value, 10);
                        updateItemVinyl();
                      }}
                      inputProps={{ min: 4 }}
                      onBlur={(e) => {
                        if (e.target.value < 4) {
                          e.target.value = 4;
                          vinyl.height = 4;
                          updateItemVinyl();
                        }
                      }}
                    />
                    <FormHelperText id="outlined-weight-helper-text">Minimo 4</FormHelperText>
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
              No hay vinilos en el carrito
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
            No hay vinilos en el carrito
          </Typography>
        </TableCell>
      </TableRow>
  );
}

export default CartVinyls