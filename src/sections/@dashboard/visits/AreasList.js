import React from 'react'
import { Box, Card, Container, Grid, Typography, FormControlLabel, Checkbox, Select, MenuItem, InputLabel, FormControl, Autocomplete, TextField, Radio, FormLabel, RadioGroup, FormGroup, Avatar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Iconify from '../../../components/iconify';

const AreaList = ({ areas, containerCheckAll, handleSelectedAreas, areasSelected, handleChangeTimeIn, handleChangeTimeOut, checkAll, handleChangeCheckAll, handleChangeTimeInCheckAll, handleChangeTimeOutCheckAll, errors, setErrors }) => {
  return (
    <FormGroup>
      <FormLabel id="demo-radio-buttons-group-label" sx={
        {
          marginBottom: '10px',
          marginTop: '10px'
        }
      }>Áreas de trabajo</FormLabel>
      {
        areas.map((area, index) =>
        (
          <Stack key={index}>
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  id={`area-checkbox-${index}`}
                  name={area.name}
                  value={area.id}
                  color="primary"
                  checked={areasSelected[index].id !== ''}
                  onChange={() => {
                    handleSelectedAreas(index);
                    setErrors({ ...errors, areas: '' });
                  }}
                  disabled={containerCheckAll}
                />
              }
              label={area.name}
            />

            {
              areasSelected[index].visible ? (
                <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: '10px' }} >

                  <LocalizationProvider locale={es} dateAdapter={AdapterDateFns} >
                    <TimePicker
                      label="Hora de entrada"
                      renderInput={(params) => <TextField InputLabelProps={{shrink: true}} {...params} size="small" sx={{ width: '14%', marginLeft: '10px', }} />}
                      value={areasSelected[index].timeIn}
                      onChange={(newValue) => {
                        handleChangeTimeIn(index, newValue);
                      }}
                      ampm
                      minTime={parseISO('2021-01-01T08:00:00')}
                      maxTime={parseISO('2021-01-01T16:00:00')}
                    />
                  </LocalizationProvider>

                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    <Iconify icon="bi:arrow-right" />
                  </Avatar>

                  <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Hora de salida"
                      renderInput={(params) => <TextField InputLabelProps={
                        {
                          shrink: true
                        }
                      } {...params}
                        size="small"
                        sx={
                          {
                            width: '14%',
                          }
                        }
                      />}
                      value={areasSelected[index].timeOut}
                      onChange={(newValue) => {
                        handleChangeTimeOut(index, newValue);
                      }}
                      ampm
                      minTime={parseISO('2021-01-01T08:00:00')}
                      maxTime={parseISO('2021-01-01T16:00:00')}
                    />
                  </LocalizationProvider>
                </Stack>
              ) : null
            }


          </Stack>
        )
        )
      }

      {
        containerCheckAll ?
          <Stack direction="row" alignItems="center" sx={{ marginTop: '3px' }}>
            <Iconify icon="bi:arrow-right" color="primary" sx={{ cursor: 'pointer', fontSize: '20px', marginLeft: '5px' }} />
            <FormControlLabel control={<Checkbox name="Marcar todas" checked={checkAll.visible} onChange={handleChangeCheckAll} />} sx={{ marginLeft: '3px' }} label="Marcar todas" />
            {checkAll.visible ? (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: '10px' }} >

                <LocalizationProvider locale={es} dateAdapter={AdapterDateFns} >
                  <TimePicker label="Hora de entrada" renderInput={(params) => <TextField {...params} size="small" sx={{ width: '25%', marginLeft: '10px', }} />}
                    value={checkAll.timeIn}
                    onChange={(newValue) => {
                      handleChangeTimeInCheckAll(newValue);
                    }}
                    ampm
                    minTime={parseISO('2021-01-01T08:00:00')}
                    maxTime={parseISO('2021-01-01T16:00:00')}
                  />
                </LocalizationProvider>

                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  <Iconify icon="bi:arrow-right" />
                </Avatar>

                <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                  <TimePicker label="Hora de salida" renderInput={(params) => <TextField {...params} size="small" sx={{ width: '25%', }} />}
                    value={checkAll.timeOut}
                    onChange={(newValue) => {
                      handleChangeTimeOutCheckAll(newValue);
                    }}
                    ampm
                    minTime={parseISO('2021-01-01T08:00:00')}
                    maxTime={parseISO('2021-01-01T16:00:00')}
                  />
                </LocalizationProvider>
              </Stack>
            ) : null}
          </Stack>
          : null
      }

    </FormGroup>
  )
}

export default AreaList