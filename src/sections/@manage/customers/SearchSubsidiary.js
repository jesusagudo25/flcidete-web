import React, { useRef } from 'react'
import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import axios from 'axios';

const filter = createFilterOptions();

const SearchSubsidiary = ({
  subsidiary,
  setSubsidiary,
  setSubsidiaryId,
  customerId,
  toast,
  handleChangeSubsidiary,
  setContainerSubsidiary,
  setEmail,
  setTelephone,
  getProvinces,
  getDistricts,
  getTownships,
  provinceSelected,
  districtSelected,
  townshipSelected,
  setProvinceSelected,
  setDistrictSelected,
  setTownshipSelected,
  errors,
  setDisabledAddCustomer
}) => {

  const previousController = useRef();

  const [options, setOptions] = React.useState([]);

  const getDataAutocomplete = (searchTerm) => {
    if (previousController.current) {
      previousController.current.abort();
    }

    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;

    if (customerId) {
      axios.get(`/api/subsidiaries/${customerId}/${searchTerm}`, { signal })
        .then((res) => {
          const results = res.data.map((item) => {
            return {
              value: item.id,
              label: item.name,
              telephone: item.telephone,
              email: item.email,
              province_id: item.province_id,
              district_id: item.district_id,
              township_id: item.township_id,
            }
          } );
          setOptions(results);
        }
        )
    }
    else {
      setOptions([]);
    }
  };

  return (
    <Autocomplete
      id="subsidiaries-search"
      value={subsidiary}
      disablePortal={false}
      options={options}
      onChange={(event, newValue) => {
        setSubsidiaryId(null);
        setContainerSubsidiary(false);
        setEmail('');
        setTelephone('');
        setProvinceSelected(9);
        setDistrictSelected(60);
        setTownshipSelected(492);
        setDisabledAddCustomer(false);

        if (typeof newValue === 'string') {
          setSubsidiary(newValue);
          toast.info('Por favor, ingrese los datos de la división');
        } else if (newValue && newValue.inputValue) {
          setSubsidiary(newValue.inputValue);
          /* Se debe abrir el espacio para crear una nueva entrada */
          setContainerSubsidiary(true);
          getProvinces();
          getDistricts(9);
          getTownships(60);
          toast.info('Por favor, ingrese los datos de la división');
        } else if (newValue) {
          getProvinces();
          getDistricts(newValue.province_id);
          getTownships(newValue.district_id);
          setSubsidiary(newValue.label);
          handleChangeSubsidiary({
            id: newValue.value,
            telephone: newValue.telephone,
            email: newValue.email,
            province_id: newValue.province_id,
            district_id: newValue.district_id,
            township_id: newValue.township_id,
          })
          toast.success('División seleccionada');
          setDisabledAddCustomer(true);
        }
      }}
      onInputChange={(event, newInputValue) => {
        if (newInputValue !== '') setSubsidiary(newInputValue);
        if (event) {

          if (event.target.value) {
            if (event.target.value.length > 1) getDataAutocomplete(event.target.value);
          }
          else {
            if (newInputValue === '') toast.warning('Por favor, ingrese el nombre de la división');
            setSubsidiary('');
            setOptions([]);
          }
        }

      }}
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
      noOptionsText="No se encontraron resultados"
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      clearOnEscape
      blurOnSelect
      freeSolo
      loading
      loadingText="Cargando..."
      renderOption={(props, option) => <li {...props}>{option.label}</li>}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Buscar división"
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="Ingrese el nombre de la división"
          error={errors.subsidiary}
          helperText={errors.subsidiary ? errors.subsidiary : null}
        />
      )}
      onBlur={() => {
        if (subsidiary === '') errors.subsidiary = 'Por favor, ingrese el nombre de la división';
        else errors.subsidiary = null;
      }
      }
    />
  )
}

export default SearchSubsidiary