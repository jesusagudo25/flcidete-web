import React, { useRef } from 'react';
import axios from 'axios';

// material
import { Autocomplete, TextField } from '@mui/material';

const SearchEvent = ({ itemSelected, handleAddEvent, errors, setErrors }) => {

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

        axios.get(`/api/events/${itemSelected.id_service}/${searchTerm}`, { signal })
            .then((res) => {
                const data = res.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id,
                        price: item.price,
                        initial_date: item.initial_date,
                        final_date: item.final_date,
                        initial_time: item.initial_time,
                        final_time: item.final_time,
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
                    handleAddEvent(
                        {
                            id: newValue.value,
                            name: newValue.label,
                            price: parseFloat(newValue.price),
                            initial_date: newValue.initial_date,
                            final_date: newValue.final_date,
                            initial_time: newValue.initial_time,
                            final_time: newValue.final_time,
                        }
                    );
                    setName('');
                    setOptions([]);
                    setErrors({ ...errors, event: false });
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
                renderInput={(params) => <TextField {...params} 
                label="Nombre del evento"
                error={errors.event}
                helperText={errors.event ? errors.event : ''}
                />}
            />
        </>
    )
}

export default SearchEvent