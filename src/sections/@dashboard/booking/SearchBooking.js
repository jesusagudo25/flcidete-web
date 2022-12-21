import React, { useEffect, useRef } from 'react';
import axios from 'axios';

// material
import { Autocomplete, TextField, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SearchBooking = ({
    documentTypeBooking,
    setDocumentTypeBooking,
    documentBooking,
    optionsBooking,
    handleChangeIdBooking,
    handleChangeDocumentBooking
}) => {

    return (
        <Stack spacing={2} sx={{ minWidth: 550 }}>

            <FormControl sx={{ width: '100%' }}>
                <InputLabel id="document-type-select-label">Tipo de documento</InputLabel>
                <Select
                    labelId="document-type-select-label"
                    id="document-type-select"
                    label="Tipo de documento"
                    value={documentTypeBooking}
                    onChange={(event) => setDocumentTypeBooking(event.target.value)}
                    size="small"
                >
                    <MenuItem value={'C'}>Cédula</MenuItem>
                    <MenuItem value={'P'}>Pasaporte</MenuItem>
                    <MenuItem value={'R'}>RUC</MenuItem>
                </Select>
            </FormControl>

            <Autocomplete
                inputValue={documentBooking}
                disablePortal={false}
                id="combo-box-component"
                options={optionsBooking}
                onChange={handleChangeIdBooking}
                onInputChange={handleChangeDocumentBooking}
                sx={{ width: '100%' }}
                size="small"
                noOptionsText="No hay reservaciones con el número de documento"
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                clearOnEscape
                blurOnSelect
                renderInput={(params) => <TextField {...params} label="Número de documento" />}
            />

        </Stack>
    )
}

export default SearchBooking