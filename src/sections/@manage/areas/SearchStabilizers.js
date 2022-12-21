import React, { useEffect, useRef } from 'react';
import axios from 'axios';

// material
import { Autocomplete, TextField } from '@mui/material';

const SearchStabilizers = ({ itemSelected, handleAddStabilizer, updateItemEmbroidery }) => {

  const previousController = useRef();

  const [options, setOptions] = React.useState([]);
  const [name, setName] = React.useState('');
  useEffect(() => {
    if (itemSelected.details.stabilizer) {
      setName(itemSelected.details.stabilizer.name);
    }
  }, [itemSelected]);

  const getDataAutoComplete = (searchTerm) => {

    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;

    axios.get(`/api/stabilizers/s/${searchTerm}`, { signal })
      .then((res) => {
        const data = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            area: item.area,
          };
        });
        setOptions(data);
      })
      .catch((err) => {
        console.log(err);
      });

  };

  return (
    <Autocomplete
      value={name}
      disablePortal={false}
      id="combo-box-component"
      options={options}
      onChange={(event, newValue) => {
        handleAddStabilizer(
          {
            id: newValue.value,
            name: newValue.label,
            area: newValue.area,
          }
        );
      }}
      onInputChange={
        (event, newInputValue) => {
          setName(newInputValue);
          if (!itemSelected.details.stabilizer) {
            itemSelected.details.stabilizer = {};
          }
          updateItemEmbroidery();
          if (event) {
            if (event.target.value.length > 0) {
              getDataAutoComplete(event.target.value);
            }
            else {
              setOptions([]);
            }
          }
        }
      }
      sx={{ width: '100%' }}
      size="small"
      noOptionsText="No hay resultados"
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      clearOnEscape
      blurOnSelect
      renderInput={(params) => <TextField {...params} label="Nombre del estabilizador" />}
    />
  )

};

export default SearchStabilizers