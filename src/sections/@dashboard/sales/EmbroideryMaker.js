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
  Select,
  MenuItem
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { CartThreads, SearchThreads, SearchStabilizers } from '../../@manage/areas';

const EmbroideryMaker = ({ itemSelected, handleAddThread, handleAddStabilizer, deleteThread, updateItemEmbroidery }) => {
  return (
    <Stack spacing={3}>
      <SearchThreads handleAddThread={handleAddThread} />
      <TableContainer sx={{ minWidth: 550, }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="40%">Nombre</TableCell>
              <TableCell >Cantidad</TableCell>
              <TableCell >Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <CartThreads threads={itemSelected.details.threads} deleteThread={deleteThread} />
          </TableBody>
        </Table>
      </TableContainer>

      <SearchStabilizers itemSelected={itemSelected} handleAddStabilizer={handleAddStabilizer} updateItemEmbroidery={updateItemEmbroidery} />

        <TextField
          id="outlined-number"
          label="Horas en la estación"
          type="number"
          size="small"
          value={itemSelected.details.hours_area}
          onChange={(e) => {
            itemSelected.details.hours_area = e.target.value
            updateItemEmbroidery();
          }}
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
            updateItemEmbroidery();
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
            updateItemEmbroidery();
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

export default EmbroideryMaker