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

const EmbroideryMaker = ({ itemSelected, handleAddThread, handleAddStabilizer, deleteThread, updateItemEmbroidery, errors, setErrors, handleOnBlurHoursArea }) => {
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

      <Stack direction="row" spacing={2} justifyContent="center">
      <SearchStabilizers itemSelected={itemSelected} handleAddStabilizer={handleAddStabilizer} updateItemEmbroidery={updateItemEmbroidery} errors={errors} setErrors={setErrors}/>
      <FormControl sx={{ width: '30%' }}>
          <InputLabel htmlFor="outlined-adornment-amount">Ancho</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">in</InputAdornment>}
            label="Ancho"
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

        <FormControl sx={{ width: '30%' }}>
          <InputLabel htmlFor="outlined-adornment-amount">Alto</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">ft</InputAdornment>}
            label="Alto"
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
      </Stack>

        <TextField
          id="outlined-number"
          label="Horas en la estación"
          type="number"
          size="small"
          value={itemSelected.details.hours_area}
          onChange={(e) => {
            itemSelected.details.hours_area = e.target.value
            updateItemEmbroidery();
            setErrors({ ...errors, hours_area: null })
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