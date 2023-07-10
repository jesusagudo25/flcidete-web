import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
// @mui
import { Button, Card, Container, Typography, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Radio, FormLabel, RadioGroup, Divider, Input, Box, TextField, FormHelperText } from '@mui/material';
import { Stack } from '@mui/system';
import config from '../../../config.json';

const AddCustomer = ({
    name,
    email,
    telephone,
    ageRangeSelected,
    setAgeRangeSelected,
    typeSexSelected,
    setTypeSexSelected,
    provinceSelected,
    setProvinceSelected,
    districtSelected,
    setDistrictSelected,
    townshipSelected,
    setTownshipSelected,
    ageRanges,
    typeSexes,
    disabledAddCustomer,
    handleChangeAgeRange,
    handleChangeTypeSex,
    handleChangeName,
    handleOnBlurName,
    handleChangeEmail,
    handleOnBlurEmail,
    handleChangeTelephone,
    setIsLoading,
    errors
}) => {

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [townships, setTownships] = useState([]);

    const getProvinces = () => {
        setIsLoading(true);
        axios.get(`${config.GEOPTYAPI_URL}/api/provinces`)
            .then((response) => {
                setProvinces(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getDistricts = (id) => {
        setIsLoading(true);
        axios.get(`${config.GEOPTYAPI_URL}/api/province/${id}/districts`)
            .then((response) => {
                setIsLoading(false);
                setDistricts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getTownships = (id) => {
        setIsLoading(true);
        axios.get(`${config.GEOPTYAPI_URL}/api/district/${id}/townships`)
            .then((response) => {
                setIsLoading(false);
                setTownships(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getProvinces();
        getDistricts(provinceSelected);
        getTownships(districtSelected);
    }, []);

    return (
        <Stack direction="row" sx={{
            marginTop: '5px', flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
        }} >
            <FormControl
                sx={{ marginTop: '15px', width: '50%' }}
            >
                <TextField id="outlined-basic" label="Nombre" variant="outlined" value={name} onChange={handleChangeName} disabled={disabledAddCustomer} required onBlur={handleOnBlurName} error={errors.name} helperText={errors.name ? errors.name : null} />

            </FormControl>

            <FormControl sx={{ marginTop: '15px', width: '45%' }}>
                <TextField id="outlined-basic" label="Correo" variant="outlined" value={email} onChange={handleChangeEmail} onBlur={handleOnBlurEmail} error={errors.email} helperText={errors.email ? errors.email : null} disabled={disabledAddCustomer} required />
            </FormControl>

            <FormControl sx={{ marginTop: '15px', width: '50%' }}>
                <TextField id="outlined-basic" label="Teléfono" variant="outlined" value={telephone} onChange={handleChangeTelephone} disabled={disabledAddCustomer} required />
            </FormControl>

            <FormControl sx={{ marginTop: '15px', width: '45%' }}>
                <FormLabel id="radio-buttons-group-label-age-range">Rango de edad</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-label-age-range"
                    name="radio-buttons-group-age-range"
                    disabled={disabledAddCustomer}
                    required
                >
                    {ageRanges.map((ageRange) => (
                        disabledAddCustomer ?
                            <FormControlLabel control={<Radio value={ageRange.id} color="default"
                                checked={parseInt(ageRangeSelected, 10) === ageRange.id} />}
                                label={ageRange.name}
                                key={ageRange.id}
                            />
                            :
                            <FormControlLabel control={<Radio value={ageRange.id} onChange={handleChangeAgeRange}
                                checked={parseInt(ageRangeSelected, 10) === ageRange.id} />}
                                label={ageRange.name}
                                key={ageRange.id}
                            />
                    ))}
                    <FormHelperText
                        sx={{
                            color: '#FF4842',
                        }}
                    >{errors.age_range ? errors.age_range : null}</FormHelperText>
                </RadioGroup>
            </FormControl>

            <FormControl sx={{ marginTop: '15px', width: '50%' }}>
                <FormLabel id="radio-buttons-group-label-gender">Genero</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-label-gender"
                    name="radio-buttons-group-gender"
                    disabled={disabledAddCustomer}
                    required
                >
                    {typeSexes.map((typeSex) => (
                        disabledAddCustomer ?
                            <FormControlLabel control={<Radio value={typeSex.id} color="default"
                                checked={parseInt(typeSexSelected, 10) === typeSex.id} />}
                                label={typeSex.name}
                                key={typeSex.id}
                            />
                            :
                            <FormControlLabel control={<Radio value={typeSex.id} onChange={handleChangeTypeSex}
                                checked={parseInt(typeSexSelected, 10) === typeSex.id} />}
                                label={typeSex.name}
                                key={typeSex.id}
                            />
                    ))}
                    <FormHelperText
                        sx={{
                            color: '#FF4842',
                        }}
                    >{errors.type_sex ? errors.type_sex : null}</FormHelperText>
                </RadioGroup>
            </FormControl>

            <FormControl sx={{ marginTop: '15px', width: '45%' }}>
                <InputLabel id="select-label-province">Provincia</InputLabel>
                <Select
                    labelId="select-label-province"
                    id="select-province"
                    label="Provincia"
                    value={provinceSelected}
                    onChange={(e) => {
                        setIsLoading(true);
                        setProvinceSelected(e.target.value);
                        axios.get(`${config.GEOPTYAPI_URL}/api/province/${e.target.value}/districts`)
                            .then((response) => {
                                setDistricts(response.data);
                                setDistrictSelected(response.data[0].id);
                                axios.get(`${config.GEOPTYAPI_URL}/api/district/${response.data[0].id}/townships`)
                                    .then((response) => {
                                        setTownships(response.data);
                                        setTownshipSelected(response.data[0].id);
                                        setIsLoading(false);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }}
                    disabled={disabledAddCustomer}
                    required
                >
                    {provinces.map((province) => (
                        <MenuItem key={province.id} value={province.id}>{province.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ marginTop: '15px', width: '50%' }}>
                <InputLabel id="select-label-district">Distrito</InputLabel>
                <Select
                    labelId="select-label-district"
                    id="select-district"
                    label="Distrito"
                    value={districtSelected}
                    onChange={(e) => {
                        setIsLoading(true);
                        setDistrictSelected(e.target.value);
                        axios.get(`${config.GEOPTYAPI_URL}/api/district/${e.target.value}/townships`)
                            .then((response) => {
                                setIsLoading(false);
                                setTownships(response.data);
                                setTownshipSelected(response.data[0].id);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }}
                    disabled={disabledAddCustomer}
                    required
                >
                    {districts.map((district) => (
                        <MenuItem key={district.id} value={district.id}>{district.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ marginTop: '15px', width: '45%' }}>
                <InputLabel id="select-label-township">Corregimiento</InputLabel>
                <Select
                    labelId="select-label-township"
                    id="select-township"
                    label="Corregimiento"
                    value={townshipSelected}
                    disabled={disabledAddCustomer}
                    onChange={(e) => {
                        setTownshipSelected(e.target.value);
                    }}
                    required
                >
                    {townships.map((township) => (
                        <MenuItem key={township.id} value={township.id}>{township.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Stack>
    )
}

export default AddCustomer