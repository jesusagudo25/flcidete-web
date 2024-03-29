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

import { CartMaterialsPrinter, SearchMaterialsPrinter } from '../../@manage/areas'

const LargePrinterServices = ({ itemSelected, handleAddMaterialPrinter, updateItemMaterialPrinter, deleteMaterialPrinter, errors, setErrors }) => {
    return (
        <Stack spacing={3}>
            <SearchMaterialsPrinter handleAddMaterialPrinter={handleAddMaterialPrinter} />

            <TableContainer sx={{ minWidth: 550, }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="40%">Nombre</TableCell>
                            <TableCell>Precio x ft^2</TableCell>
                            <TableCell>Área ft^2</TableCell>
                            <TableCell>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <CartMaterialsPrinter materials={itemSelected.details.materials} deleteMaterialPrinter={deleteMaterialPrinter} updateItemMaterialPrinter={updateItemMaterialPrinter} />
                    </TableBody>
                </Table>
                <FormHelperText sx={{
                    color: 'red',
                    alignSelf: 'center',
                }}>{errors.materials ? errors.materials : null}</FormHelperText>
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
                        updateItemMaterialPrinter();
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
                        updateItemMaterialPrinter();
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

export default LargePrinterServices