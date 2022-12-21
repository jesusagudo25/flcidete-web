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
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { CartEvents, SearchEvent } from '../../@manage/events';

const Events = ({ itemSelected, handleAddEvent, deleteEvent }) => {
    console.log(itemSelected);
    return (
        <Stack spacing={3} sx={{ minWidth: 550 }}>
            <SearchEvent itemSelected={itemSelected} handleAddEvent={handleAddEvent} />

            <TableContainer sx={{ minWidth: 550, }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="40%">Nombre</TableCell>
                            <TableCell >Precio </TableCell>
                            <TableCell >Fecha</TableCell>
                            <TableCell >Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <CartEvents event={itemSelected.details.event} deleteEvent={deleteEvent} />
                    </TableBody>
                </Table>
            </TableContainer>

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

export default Events