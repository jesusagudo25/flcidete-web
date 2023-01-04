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
import { CartVinyls, SearchVinyls } from '../../@manage/areas'

const VinylMaker = ({ itemSelected, handleAddVinyl, updateItemVinyl, deleteVinyl, errors, setErrors, handleOnBlurHoursArea }) => {
  return (
    <Stack spacing={3}>
      <SearchVinyls handleAddVinyl={handleAddVinyl} />

      <TableContainer sx={{ minWidth: 550, }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="40%">Nombre</TableCell>
              <TableCell >Precio x in^2</TableCell>
              <TableCell >Área in^2</TableCell>
              <TableCell >Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <CartVinyls vinyls={itemSelected.details.vinyls} deleteVinyl={deleteVinyl} updateItemVinyl={updateItemVinyl} />
          </TableBody>
        </Table>
      </TableContainer>

      <TextField
        id="outlined-number"
        label="Horas en la estación"
        type="number"
        size="small"
        value={itemSelected.details.hours_area}
        onChange={(e) => {
          itemSelected.details.hours_area = e.target.value
          updateItemVinyl();
        }}
        onBlur={handleOnBlurHoursArea}
        error={!!errors.hours_area}
        helperText={errors.hours_area ? errors.hours_area : null}
      />

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
            updateItemVinyl();
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
            updateItemVinyl();
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

export default VinylMaker