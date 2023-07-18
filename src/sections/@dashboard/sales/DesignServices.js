import React from 'react'
import {
  Stack, FormControl, InputLabel,

  FormHelperText
} from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

const DesignServices = ({ itemSelected, updateItemDesign, errors, setErrors}) => {

    return (
        <Stack spacing={3} sx={{ minWidth: '550px' }}>
            <FormControl sx={{ width: '100%' }} error={!!errors?.base_cost}>
                <InputLabel htmlFor="outlined-adornment-amount">Costo base</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Costo base"
                    placeholder='0.00'
                    size="small"
                    value={itemSelected.details.base_cost}
                    onChange={(e) => {
                        itemSelected.details.base_cost = e.target.value;
                        updateItemDesign();
                        setErrors({ ...errors, base_cost: '' })
                    }}
                    type="number"
                />
                <FormHelperText>{errors?.base_cost}</FormHelperText>
            </FormControl>
        </Stack>
    )
}

export default DesignServices