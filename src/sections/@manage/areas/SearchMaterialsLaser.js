import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// material
import { Autocomplete, TextField } from '@mui/material';

const SearchMaterialsLaser = ({handleAddMaterialLaser}) => {

  const previousController = useRef();

  const [options, setOptions] = React.useState([]);
  const [name, setName] = React.useState('');

  const getDataAutoComplete = (searchTerm) => {

    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;

    axios.get(`/api/materials-laser/s/${searchTerm}`, { signal })
      .then((res) => {
        const data = res.data.map((item) => {
          return {
            label: item.name,
            value: item.id,
            purchase_price: item.purchase_price,
            sale_price: item.sale_price,
            area: item.area
          };
        });
        setOptions(data);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  return (
    <>
      <Autocomplete
        value={name}
        disablePortal={false}
        id="combo-box-component"
        options={options}
        onChange={(event, newValue) => {
          handleAddMaterialLaser(
            {
              id: newValue.value,
              name: newValue.label,
              sale_price: parseFloat(newValue.sale_price),
              area: newValue.area,
            }
          );
          setOptions([]);
          setName('');
        }}
        onInputChange={
          (event, newInputValue) => {
            setName(newInputValue);
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
        renderInput={(params) => <TextField {...params} label="Nombre del material" />}
      />
    </>
  )
}

export default SearchMaterialsLaser