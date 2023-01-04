import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Stack, FormControl, InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  FormHelperText,
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { SearchComponents, CartComponents } from '../../@manage/areas'

/* Ventana modal abierta - Elec Services - Acciones:
Ingresar datos(Componentes, extra, descripción del extra, costo base)
Cerrar modal
Guardar informacion
*/

const ElectronicServices = ({ itemSelected, updateItemElectronic, handleAddComponent, deleteComponent, errors, setErrors }) => {

  return (
    <Stack spacing={3}>
      <SearchComponents handleAddComponent={handleAddComponent} errors={errors} setErrors={setErrors}/>

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
            <CartComponents components={itemSelected.details.components} deleteComponent={deleteComponent} updateItemElectronic={updateItemElectronic} />
          </TableBody>
        </Table>
      </TableContainer>

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
            updateItemElectronic();
            setErrors({ ...errors, base_cost: '' })
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
            updateItemElectronic();
          }}
        />
      </FormControl>

      <FormControl sx={{ width: '100%' }} error={!!errors?.base_cost}
      >
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
        <FormHelperText>{errors?.base_cost}</FormHelperText>
      </FormControl>

    </Stack>
  )
}

export default ElectronicServices