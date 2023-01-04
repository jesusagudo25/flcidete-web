import React, { useEffect, useRef } from 'react';
import axios from 'axios';

// material
import { Autocomplete, TextField } from '@mui/material';

const SearchSoftware = ({itemSelected, handleAddSoftware, updateItemSoftware, errors, setErrors }) => {

    const previousController = useRef();

    const [options, setOptions] = React.useState([]);
    const [name, setName] = React.useState('');

    useEffect(() => {
        if (itemSelected.details.software) {
            setName(itemSelected.details.software.name);
        }
    }, []);

    const getDataAutoComplete = (searchTerm) => {

        if (previousController.current) {
            previousController.current.abort();
        }
        const controller = new AbortController();
        const signal = controller.signal;
        previousController.current = controller;

        axios.get(`/api/softwares/s/${searchTerm}`, { signal })
            .then((res) => {
                const data = res.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id,
                        purchase_price: item.purchase_price,
                        sale_price: item.sale_price
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
                    setErrors({ ...errors, software: '' });
                    handleAddSoftware(
                        {
                            id: newValue.value,
                            name: newValue.label,
                            purchase_price: parseFloat(newValue.purchase_price),
                            sale_price: parseFloat(newValue.sale_price),
                        }
                    );
                }}
                onInputChange={
                    (event, newInputValue) => {
                        setName(newInputValue);
                        if (!itemSelected.details.software) {
                            itemSelected.details.software = {};
                        }
                        updateItemSoftware();
                        if (event) {
                            if(event.target.value){
                                if (event.target.value.length > 0) {
                                    getDataAutoComplete(event.target.value);
                                }
                                else {
                                    setOptions([]);
                                }
                            }
                            else if(event.target.value === undefined){
                                    handleAddSoftware(null);
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
                renderInput={(params) => <TextField {...params} 
                label="Nombre del software"
                error={errors.software}
                helperText={errors.software ? errors.software : ''}
                />}
            />
        </>
    )
}

export default SearchSoftware