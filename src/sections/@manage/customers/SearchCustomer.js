import React from 'react'

// materialWW
import { Select, MenuItem, InputLabel, FormControl, Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { Stack } from '@mui/system';

const filter = createFilterOptions();

const SearchCustomer = ({
  options,
  handleChangeDocumentType,
  documentType,
  handleChangeDocument,
  handleChangeIdCustomer,
  document,
  handleOnBlurDocument,
  errors,
  documentAvailable
}) => {

  return (

    <Stack direction="row" sx={{
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <FormControl sx={{ width: '50%' }}>
        <InputLabel id="customer-select-label"
          sx={{ width: 400 }}
        >Tipo de documento</InputLabel>
        <Select
          labelId="customer-select-label"
          id="customer-select"
          label="Tipo de documento"
          value={documentType}
          onChange={handleChangeDocumentType}
        >
          <MenuItem value={'C'}>Cédula</MenuItem>
          <MenuItem value={'P'}>Pasaporte</MenuItem>
          {
            documentAvailable ? <MenuItem value={'R'}>RUC</MenuItem> : null
          }
        </Select>
      </FormControl>

      <Autocomplete
        disablePortal={false}
        id="combo-box-customer"
        options={options}
        onChange={handleChangeIdCustomer}
        inputValue={document}
        onInputChange={handleChangeDocument}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          const { inputValue } = params;
          // Sugerir la creación de un nuevo valor
          const isExisting = options.some((option) => inputValue === option.label);

          if (inputValue.length > 4) {
            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                label: `Agregar "${inputValue}"`,
              });
            }
          }

          return filtered;
        }}
        getOptionLabel={(option) => {
          // Valor seleccionado con enter, directamente desde la entrada
          if (typeof option === 'string') {
            return option;
          }
          // Agrega la opción "xxx" creada dinámicamente
          if (option.inputValue) {
            return option.inputValue;
          }
          // Opción normal
          return option.label;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        sx={{ width: '45%' }}
        freeSolo
        loading
        loadingText="Cargando..."
        renderOption={(props, option) => <li {...props}>{option.label}</li>}
        renderInput={(params) => <TextField 
          {...params} 
          label="Número de documento"
          error={errors.document}
          helperText={errors.document ? errors.document : null}
          />}
        onBlur={handleOnBlurDocument}
      />
    </Stack>


  )
}

export default SearchCustomer