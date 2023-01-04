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
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../../components/iconify';
import { SearchComponents, CartComponents } from '../../@manage/areas'

const ElectronicMaker = ({ itemSelected, updateItemElectronic, handleAddComponent, deleteComponent, errors, setErrors, handleOnBlurHoursArea }) => {


  return (
    <Stack spacing={3}>
      <SearchComponents handleAddComponent={handleAddComponent} />

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

      <TextField
        id="outlined-number"
        label="Horas en la estación"
        type="number"
        size="small"
        value={itemSelected.details.hours_area}
        onChange={(e) => {
          itemSelected.details.hours_area = e.target.value
          updateItemElectronic()
          setErrors({ ...errors, hours_area: '' })
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
            updateItemElectronic();
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

export default ElectronicMaker