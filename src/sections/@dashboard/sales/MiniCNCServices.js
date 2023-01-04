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
  FormLabel,
  FormHelperText
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { CartMaterialsMillings, SearchMaterialsMillings } from '../../@manage/areas'

const MiniCNCServices = ({ itemSelected, handleAddMaterialMilling, updateItemMilling, deleteMaterialMilling, errors, setErrors }) => {
  return (
    <Stack spacing={3}>
      <SearchMaterialsMillings handleAddMaterialMilling={handleAddMaterialMilling} />

      <TableContainer sx={{ minWidth: 550, }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="40%">Nombre</TableCell>
              <TableCell >Cantidad</TableCell>
              <TableCell >Precio</TableCell>
              <TableCell >Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <CartMaterialsMillings materials={itemSelected.details.materials} deleteMaterialMilling={deleteMaterialMilling} updateItemMilling={updateItemMilling} />
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="column">
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

          <FormControl sx={{ width: '25%' }} error={!!errors?.hours }>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">H</InputAdornment>}
              placeholder='0'
              size="small"
              value={itemSelected.details.hours}
              onChange={(e) => {
                itemSelected.details.hours = e.target.value;
                setErrors({ ...errors,hours: '' })
                updateItemMilling()
              }}
              type="number"
            />
          </FormControl>

          <FormControl sx={{ width: '25%' }} error={!!errors?.minutes}>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={<InputAdornment position="start">M</InputAdornment>}
              placeholder='0'
              size="small"
              value={itemSelected.details.minutes}
              onChange={(e) => {
                itemSelected.details.minutes = e.target.value;
                setErrors({ ...errors, minutes: '' })
                updateItemMilling()
              }}
              type="number"
            />
          </FormControl>
        </Box>
        <FormHelperText sx={{
          color: 'red',
          alignSelf: 'center',
        }}>{errors.hours ? errors.hours : errors.minutes ? errors.minutes : null}</FormHelperText>
      </Stack>

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
            updateItemMilling();
          }}
          type="number"
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
            updateItemMilling();
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

export default MiniCNCServices