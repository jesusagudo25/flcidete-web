import React from 'react'
import {
  Stack, FormControl, InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Box,
  FormLabel
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { CartMaterialsLaser, SearchMaterialsLaser } from '../../@manage/areas';

const LaserCNCServices = ({ itemSelected, handleAddMaterialLaser, updateItemLaser, deleteMaterialLaser }) => {
  return (
    <Stack spacing={3}>
      <SearchMaterialsLaser handleAddMaterialLaser={handleAddMaterialLaser} />

      <TableContainer sx={{ minWidth: 550, }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="40%">Nombre</TableCell>
              <TableCell >Precio x ft^2</TableCell>
              <TableCell >Área ft^2</TableCell>
              <TableCell >Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <CartMaterialsLaser materials={itemSelected.details.materials} deleteMaterialLaser={deleteMaterialLaser} updateItemLaser={updateItemLaser} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-start',
          gap: '15px',
        }}
      >
        <FormLabel component="legend" sx={{
          fontSize: '0.875rem',
        }}>Tiempo de fabricación: </FormLabel>

        <FormControl sx={{ width: '25%' }}>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">H</InputAdornment>}
            placeholder='0'
            size="small"
            value={itemSelected.details.hours}
            onChange={(e) => {
              itemSelected.details.hours = e.target.value;
              updateItemLaser()
            }}
          />
        </FormControl>

        <FormControl sx={{ width: '25%' }}>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">M</InputAdornment>}
            placeholder='0'
            size="small"
            value={itemSelected.details.minutes}
            onChange={(e) => {
              itemSelected.details.minutes = e.target.value;
              updateItemLaser()
            }}
          />
        </FormControl>
      </Box>

      <FormControl sx={{ width: '100%' }}>
        <InputLabel htmlFor="outlined-adornment-amount">Extra</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Extra"
          placeholder='0.00'
          size="small"
          value={itemSelected.details.extra}
          onChange={(e) => {
            itemSelected.details.extra = e.target.value;
            updateItemLaser();
          }}
        />
      </FormControl>

      <FormControl sx={{ width: '100%' }}>
        <TextField
          id="outlined-textarea"
          label="Descripción del extra"
          multiline
          size="small"
          value={itemSelected.details.extra_description}
          onChange={(e) => {
            itemSelected.details.extra_description = e.target.value;
            updateItemLaser();
          }}
        />
      </FormControl>

      <FormControl sx={{ width: '100%' }}>
        <InputLabel htmlFor="outlined-adornment-amount">Costo base</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Costo base"
          placeholder='0.00'
          disabled
          size="small"
          value={itemSelected.details.base_cost}
        />
      </FormControl>

    </Stack>
  )
}

export default LaserCNCServices