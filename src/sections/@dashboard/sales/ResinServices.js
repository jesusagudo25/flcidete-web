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
import { CartResins, SearchResins } from '../../@manage/areas';

const ResinServices = ({ itemSelected, handleAddResin, updateItemResin, deleteResin }) => {
  return (
    <Stack spacing={3}>
      <SearchResins handleAddResin={handleAddResin} />

      <TableContainer sx={{ minWidth: 550, }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="40%">Nombre</TableCell>
              <TableCell >Gramos</TableCell>
              <TableCell >Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <CartResins resins={itemSelected.details.resins} deleteResin={deleteResin} updateItemResin={updateItemResin} />
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
              updateItemResin()
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
              updateItemResin()
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
            updateItemResin();
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
            updateItemResin();
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

export default ResinServices