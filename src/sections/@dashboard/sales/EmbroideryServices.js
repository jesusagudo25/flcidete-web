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
  MenuItem,
  FormHelperText
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { CartThreads, SearchThreads, SearchStabilizers } from '../../@manage/areas';

const EmbroideryServices = ({ itemSelected, handleAddThread, handleAddStabilizer, deleteThread, updateItemEmbroidery, errors, setErrors }) => {
  return (
    <Stack spacing={3}>
      <SearchThreads handleAddThread={handleAddThread} errors={errors} setErrors={setErrors} />

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

      <SearchStabilizers itemSelected={itemSelected} handleAddStabilizer={handleAddStabilizer} updateItemEmbroidery={updateItemEmbroidery} errors={errors} setErrors={setErrors} />

      <Stack direction="row" spacing={2} justifyContent="center">
        <FormControl size="small" sx={{ width: '30%' }}>
          <InputLabel id="hoop-select-label">Bastidor</InputLabel>
          <Select
            labelId="hoop-select-label"
            id="hoop-simple-select"
            label="Bastidor"
            value={itemSelected.details.hoop_size}
            onChange={(e) => {
              itemSelected.details.hoop_size = e.target.value;
              updateItemEmbroidery();
            }}
          >
            <MenuItem value={'5x7'}>5x7</MenuItem>
            <MenuItem value={'4x5'}>4x5</MenuItem>
            <MenuItem value={'1x2.5'}>1x2.5</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ width: '32%' }}>
          <InputLabel htmlFor="outlined-adornment-amount">Ancho del bordado</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">in</InputAdornment>}
            label="Ancho del bordado"
            placeholder='0'
            size="small"
            value={itemSelected.details.width}
            onChange={(e) => {
              itemSelected.details.width = e.target.value;
              updateItemEmbroidery();
            }}
            type="number"
          />
        </FormControl>

        <FormControl sx={{ width: '32%' }}>
          <InputLabel htmlFor="outlined-adornment-amount">Alto de bordado</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">in</InputAdornment>}
            label="Alto de bordado"
            placeholder='0'
            size="small"
            value={itemSelected.details.height}
            onChange={(e) => {
              itemSelected.details.height = e.target.value;
              updateItemEmbroidery();
            }}
            type="number"
          />
        </FormControl>

        <FormControl sx={{ width: '30%' }}>
          <TextField id="outlined-basic" label="Cantidad" variant="outlined" type="number" size='small' value={itemSelected.details.quantity} onChange={
            (e) => {
              itemSelected.details.quantity = parseInt(e.target.value, 10);
              updateItemEmbroidery();
            }
          } />
        </FormControl>
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
            updateItemEmbroidery();
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
            updateItemEmbroidery();
          }}
        />
      </FormControl>

      <FormControl sx={{ width: '100%' }} error={!!errors?.base_cost}>
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

export default EmbroideryServices