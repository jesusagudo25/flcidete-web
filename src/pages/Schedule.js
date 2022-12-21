import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import axios from 'axios';
// @mui
import { LoadingButton } from '@mui/lab';
import {
    Card,
    Table,
    Stack,
    Paper,
    Avatar,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Dialog,
    DialogContent,
    DialogActions,
    Box,
    Backdrop,
    CircularProgress,
    TextField,
    Button,
    DialogTitle,
    Radio,
    RadioGroup,
    FormControlLabel,
    styled,
    Switch,
    FormControl,
    FormLabel,
    Select,
    InputLabel,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    Tab,
    Tabs,
    Grid,
    Input
} from '@mui/material';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es';
import { Link } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import { TimePicker } from '@mui/x-date-pickers';
import Iconify from '../components/iconify';

import { getCalendarEvents } from '../sections/@dashboard/schedule/getCalendarEvents';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

/* ----------------- */

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const Schedule = () => {

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [showCreate, setShowCreate] = useState(false);
    const [showEditEvent, setShowEditEvent] = useState(false);

    /* Datos eventos */
    const [title, setTitle] = useState(''); // Título del evento
    const [eventCategory, setEventCategory] = useState(''); // Categoría del evento
    const [initialDate, setInitialDate] = useState(new Date()); // Fecha inicial del evento
    const [finalDate, setFinalDate] = useState(new Date()); // Fecha final del evento
    const [initialTime, setInitialTime] = useState(new Date()); // Hora inicial del evento
    const [finalTime, setFinalTime] = useState(new Date()); // Hora final del evento
    const [price, setPrice] = useState(0); // Precio del evento
    const [maxParticipants, setMaxParticipants] = useState(0); // Máximo de participantes


    /* Customers */
    const [id, setId] = useState(null);
    const [containerTypeVisit, setContainerTypeVisit] = useState('I');
    const [documentType, setDocumentType] = useState('C');
    const [documentNumber, setDocumentNumber] = useState(null);
    const [name, setName] = useState(null);
    const [date, setDate] = useState(null);


    /* Datos visita */
    const [areasSelected, setAreasSelected] = useState([]); // [{id: '', checked: false}
    const [reasonSelected, setReasonSelected] = useState(1);
    const [checkAll, setCheckAll] = useState({});
    const [containerCheckAll, setContainerCheckAll] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [areas, setAreas] = useState([]);
    const [reasonVisits, setReasonVisits] = useState([]);

    /* Bookings */

    const handleChangeTypeVisit = (event) => {
        setContainerTypeVisit(event.target.value);
    };

    const handleChangeReasonSelected = (event) => {
        setReasonSelected(event.target.value);

        const selected = reasonVisits.find((reason) => reason.id === event.target.value);

        if (selected.isGroup) {
            setAreasSelected(
                new Array(areas.length).fill(
                    {
                        id: '',
                        visible: false,
                        timeIn: new Date(),
                        timeOut: new Date()
                    }
                )
            );
            setCheckAll(
                {
                    visible: false,
                    timeIn: new Date(),
                    timeOut: new Date()
                }
            );
            setContainerCheckAll(true);
        }
        /* No es una visita libre */
        else {
            setContainerCheckAll(false);
        }

    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log(areasSelected);
    };

    const handleSelectedAreas = (position) => {
        const updatedCheckedState = areasSelected.map((item, index) =>
            index === position ? {
                ...item,
                visible: !item.visible,
                id: item.visible ? '' : areas[position].id
            } : item
        );
        setAreasSelected(updatedCheckedState);
    }

    const handleChangeTimeIn = (position, time) => {
        const updatedCheckedState = areasSelected.map((item, index) =>
            index === position ? {
                ...item,
                timeIn: time
            } : item
        );
        setAreasSelected(updatedCheckedState);
    }

    const handleChangeTimeOut = (position, time) => {
        const updatedCheckedState = areasSelected.map((item, index) =>
            index === position ? {
                ...item,
                timeOut: time
            } : item
        );
        setAreasSelected(updatedCheckedState);
    }

    const handleChangeCheckAll = (event) => {

        setCheckAll({
            ...checkAll,
            visible: !checkAll.visible
        });

        if (event.target.checked) {
            setAreasSelected(
                areas.map((area) => {
                    return {
                        id: area.id,
                        visible: false,
                        timeIn: new Date(),
                        timeOut: new Date()
                    }
                })
            );
        }
        else {
            setAreasSelected(
                areas.map((area) => {
                    return {
                        id: '',
                        visible: false,
                        timeIn: new Date(),
                        timeOut: new Date()
                    }
                })
            );
        }
    }

    const handleChangeTimeInCheckAll = (time) => {
        setCheckAll({
            ...checkAll,
            timeIn: time
        });

        setAreasSelected(
            areasSelected.map((area) => {
                return {
                    ...area,
                    timeIn: time
                }
            })
        )
    }

    const handleChangeTimeOutCheckAll = (time) => {
        setCheckAll({
            ...checkAll,
            timeOut: time
        });
        setAreasSelected(
            areasSelected.map((area) => {
                return {
                    ...area,
                    timeOut: time
                }
            })
        )
    }

    /* Modal dialog */

    const handleCreateDialog = (event) => {
        setOpen(true);

    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleSubmitDialog = async (event) => {
        event.preventDefault();
        if (id) {
            // await axios.put(`/api/events/${id}`, {
        } else {
            await axios.post('/api/bookings', {
                'type': containerTypeVisit,
                'document_type': documentType,
                'document_number': documentNumber,
                name,
                date,
                'reason_visit_id': reasonSelected,
                areas: areasSelected.filter((area) => area.id !== '').map((area) => {
                    return {
                        area_id: area.id,
                        start_time: format(area.timeIn, 'HH:mm:ss'),
                        end_time: format(area.timeOut, 'HH:mm:ss')
                    }
                }),
                file: containerTypeVisit === 'G' ? selectedFile : null
            },
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }
            );
        }
        handleCloseDialog();
        getCalendarEvents();
    };

    /* Get api */
    const getAreas = async () => {
        const response = await axios.get('/api/areas');
        setAreas(response.data);
        setAreasSelected(
            new Array(response.data.length).fill(
                {
                    id: '',
                    visible: false,
                    timeIn: new Date(),
                    timeOut: new Date()
                }
            )
        );
        setCheckAll(
            {
                visible: false,
                timeIn: new Date(),
                timeOut: new Date()
            }
        );
    }

    const getReasonVisits = async () => {
        const response = await axios.get('/api/reason-visits/bookings');
        setReasonVisits(response.data);
    }

    useEffect(() => {
        getAreas();
        getReasonVisits();
    }, []);

    return (
        <>
            <Helmet>
                <title> Agenda: Reservaciones y eventos | Fab Lab System </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Agenda
                </Typography>

                <Card sx={
                    {
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }
                }>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        locale={esLocale}
                        initialView='dayGridMonth'
                        editable
                        selectable
                        selectMirror
                        dayMaxEvents
                        displayEventEnd
                        weekends={false}
                        events={getCalendarEvents()}
                        eventClick={(info) => {
                            setShowEditEvent(true);
                            if (info.event.classNames.includes('event')) {
                                setId(info.event.groupId);
                                axios.get(`/api/events/${info.event.groupId}`)
                                    .then((response) => {
                                        setOpen(true);
                                        setTitle(response.data.name);
                                        setEventCategory(response.data.event_category.name);
                                        setInitialDate(response.data.initial_date);
                                        setFinalDate(response.data.final_date);


                                        setInitialTime(parseISO(`${response.data.initial_date.split('T')[0]} ${response.data.initial_time}`));
                                        setFinalTime(parseISO(`${response.data.final_date.split('T')[0]} ${response.data.final_time}`));
                                        setPrice(response.data.price);
                                        setMaxParticipants(response.data.max_participants);
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }
                            else {
                                setOpen(true);
                                setId(info.event.groupId);
                                setShowEditEvent(false);
                            }
                        }}
                        eventDrop={(info) => {
                            console.log(info.event)
                        }}
                        eventTimeFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                        }}
                        dateClick={(info) => {
                            setOpen(true);
                            setDate(info.dateStr);
                            setShowCreate(true);
                        }}
                    />
                </Card>
            </Container>


            {/* Dialog */}

            <BootstrapDialog
                onClose={handleCloseDialog}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth='md'
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
                    Gestión de Agenda
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    {
                        showEditEvent ?
                            (
                                <Stack direction="row" sx={{
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    minWidth: 550,
                                    gap: 3
                                }}
                                >

                                    <FormControl sx={{ width: '48%' }}>
                                        <TextField id="outlined-basic" variant="outlined" value={title} size="small" disabled />
                                    </FormControl>

                                    <FormControl sx={{ width: '48%' }}>
                                        <TextField id="outlined-basic" variant="outlined" value={eventCategory} size="small" disabled />
                                    </FormControl>

                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Fecha de inicio"
                                            value={initialDate}
                                            disabled
                                            renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                                        />
                                    </LocalizationProvider>

                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Fecha de finalización"
                                            value={finalDate}
                                            disabled
                                            renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                                        />
                                    </LocalizationProvider>

                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <TimePicker
                                            label="Hora de inicio"
                                            value={initialTime}
                                            disabled
                                            renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                                        />
                                    </LocalizationProvider>

                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <TimePicker
                                            label="Hora de finalización"
                                            value={finalTime}
                                            disabled
                                            renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                                        />
                                    </LocalizationProvider>

                                    <FormControl sx={{ width: '48%' }}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Precio de evento</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            label="Precio de evento"
                                            placeholder='0.00'
                                            size="small"
                                            value={price}
                                            type="number"
                                            disabled
                                        />
                                    </FormControl>

                                    <FormControl sx={{ width: '48%' }}>
                                        <TextField id="outlined-basic" label="Cantidad de participantes" variant="outlined" value={maxParticipants} size="small" onChange={(event) => {
                                            setMaxParticipants(event.target.value)
                                        }}
                                            type="number"
                                            disabled
                                            required />
                                    </FormControl>
                                </Stack>
                            )
                            :
                            (
                                <>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                            <Tab label="Información general" {...a11yProps(0)} />
                                            <Tab label="Áreas para reservación" {...a11yProps(1)} />
                                            {
                                                containerTypeVisit === 'G' ?
                                                    <Tab label="Lista de visitantes" {...a11yProps(1)} />
                                                    :
                                                    null
                                            }
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={value} index={0}>
                                        <Stack sx={{
                                            minWidth: 550,
                                        }}
                                            spacing={3}
                                        >
                                            <FormControl
                                            >
                                                <FormLabel id="demo-radio-buttons-group-label"
                                                >Selecciona el tipo de reserva</FormLabel>
                                                {/* Selecciona si es visita individual o grupal */}
                                                <RadioGroup
                                                    aria-labelledby="buttons-group-label-type-visit"
                                                    defaultValue="female"
                                                    name="radio-buttons-group-type-visit"
                                                >
                                                    <Stack direction="row">
                                                        <FormControlLabel control={<Radio value="I" onChange={handleChangeTypeVisit}
                                                            checked={containerTypeVisit === 'I'} />}
                                                            label="Individual"
                                                        />
                                                        <FormControlLabel control={<Radio value="G" onChange={handleChangeTypeVisit}
                                                            checked={containerTypeVisit === 'G'} />}
                                                            label="Grupal"
                                                        />
                                                    </Stack>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormControl sx={{ width: '100%' }}>
                                                <InputLabel id="document-type-select-label">Tipo de documento</InputLabel>
                                                <Select
                                                    labelId="document-type-select-label"
                                                    id="document-type-select"
                                                    label="Tipo de documento"
                                                    value={documentType}
                                                    onChange={(event) => setDocumentType(event.target.value)}
                                                    size="small"
                                                >
                                                    <MenuItem value={'C'}>Cédula</MenuItem>
                                                    <MenuItem value={'P'}>Pasaporte</MenuItem>
                                                    <MenuItem value={'R'}>RUC</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl sx={{ width: '100%' }}>
                                                <TextField id="outlined-basic" label="Número de documento" variant="outlined" value={documentNumber} size="small" onChange={(event) => {
                                                    setDocumentNumber(event.target.value)
                                                }} />
                                            </FormControl>

                                            <FormControl sx={{ width: '100%' }}>
                                                <TextField id="outlined-basic" label="Nombre" variant="outlined" value={name} size="small" onChange={(event) => {
                                                    setName(event.target.value)
                                                }} />
                                            </FormControl>

                                            <FormControl size="small">
                                                <InputLabel id="reason-select-label">Razón de visita</InputLabel>
                                                <Select
                                                    labelId="reason-select-label"
                                                    id="reason-select"
                                                    value={reasonSelected}
                                                    label="Razón de visita"
                                                    onChange={handleChangeReasonSelected}
                                                    required
                                                >
                                                    {
                                                        reasonVisits.map((item) => (
                                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>

                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Fecha de visita"
                                                    value={date}
                                                    onChange={(newValue) => {
                                                        setDate(newValue);
                                                    }}
                                                    renderInput={(params) => <TextField size='small' {...params} />}
                                                    disabled
                                                />
                                            </LocalizationProvider>


                                        </Stack>
                                    </TabPanel>
                                    <TabPanel value={value} index={1}>
                                        <Stack sx={{
                                            minWidth: 550,
                                        }}
                                            spacing={1}
                                        >
                                            {areas.map((area, index) => (
                                                <Stack key={index}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                id={`area-checkbox-${index}`}
                                                                name={area.name}
                                                                value={area.id}
                                                                color="primary"
                                                                checked={areasSelected[index].id !== ''}
                                                                onChange={() => handleSelectedAreas(index)}
                                                                disabled={containerCheckAll}
                                                            />
                                                        }
                                                        label={area.name}
                                                    />

                                                    {areasSelected[index].visible ? (
                                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: '10px' }} >
                                                            <LocalizationProvider dateAdapter={AdapterDateFns} >
                                                                <TimePicker
                                                                    label="Hora de entrada"
                                                                    renderInput={(params) => <TextField {...params}
                                                                        size="small"
                                                                        sx={{ width: '25%', marginLeft: '10px', }} />}
                                                                    value={areasSelected[index].timeIn}
                                                                    onChange={(newValue) => {
                                                                        handleChangeTimeIn(index, newValue);
                                                                    }}
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

                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <TimePicker
                                                                    label="Hora de salida"
                                                                    renderInput={(params) => <TextField {...params}
                                                                        size="small"
                                                                        sx={
                                                                            {
                                                                                width: '25%',
                                                                            }
                                                                        }
                                                                    />}
                                                                    value={areasSelected[index].timeOut}
                                                                    onChange={(newValue) => {
                                                                        handleChangeTimeOut(index, newValue);
                                                                    }}
                                                                />
                                                            </LocalizationProvider>
                                                        </Stack>
                                                    ) : null}
                                                </Stack>
                                            ))}

                                            {
                                                containerCheckAll ?
                                                    <Stack direction="row" alignItems="center" sx={{ marginTop: '3px' }}>
                                                        <Iconify icon="bi:arrow-right" color="primary" sx={{ cursor: 'pointer', fontSize: '20px', marginLeft: '5px' }} />
                                                        <FormControlLabel control={<Checkbox name="Marcar todas" checked={checkAll.visible} onChange={handleChangeCheckAll} />} sx={{ marginLeft: '3px' }} label="Marcar todas" />
                                                        {checkAll.visible ? (
                                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: '10px' }} >
                                                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                                                    <TimePicker label="Hora de entrada" renderInput={(params) => <TextField {...params} size="small" sx={{ width: '25%', marginLeft: '10px', }} />}
                                                                        value={checkAll.timeIn}
                                                                        onChange={(newValue) => {
                                                                            handleChangeTimeInCheckAll(newValue);
                                                                        }}
                                                                    />
                                                                </LocalizationProvider>

                                                                <Box sx={{ backgroundColor: 'grey.200', borderRadius: '100%', padding: '10px', }}
                                                                ><Iconify icon="bi:arrow-right" /></Box>

                                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                    <TimePicker label="Hora de salida" renderInput={(params) => <TextField {...params} size="small" sx={{ width: '25%', }} />}
                                                                        value={checkAll.timeOut}
                                                                        onChange={(newValue) => {
                                                                            handleChangeTimeOutCheckAll(newValue);
                                                                        }}
                                                                    />
                                                                </LocalizationProvider>
                                                            </Stack>
                                                        ) : null}
                                                    </Stack>
                                                    : null
                                            }
                                        </Stack>
                                    </TabPanel>
                                    {
                                        containerTypeVisit === 'G' ?
                                            <TabPanel value={value} index={2}>
                                                <Stack
                                                    direction="row"
                                                    spacing={2}
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Link
                                                        sx={{
                                                            textDecoration: 'none',
                                                            color: 'inherit',
                                                            width: '100%',
                                                        }}
                                                        href="http://localhost:8000/api/customers/download"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        style={
                                                            {
                                                                textDecoration: 'none',
                                                                color: 'inherit',
                                                            }
                                                        }
                                                    >
                                                        <Button variant="contained"
                                                            size='medium'
                                                            sx={{
                                                                width: '180px',
                                                            }}
                                                        >
                                                            Descargar</Button>
                                                    </Link>

                                                    <Avatar
                                                        sx={{
                                                            bgcolor: 'primary.main',
                                                            color: 'primary.contrastText',
                                                        }}
                                                    >
                                                        <Iconify icon="bi:arrow-right" />
                                                    </Avatar>
                                                    {/* Input file blue */}
                                                    <Input
                                                        accept=".xlsx"
                                                        type="file"
                                                        onChange={(e) => {
                                                            if (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                                                                setSelectedFile(e.target.files[0]);
                                                            }
                                                            else {
                                                                alert('Formato no válido');
                                                                setSelectedFile(null);
                                                            }
                                                        }}
                                                        sx={{
                                                            width: '35%',
                                                        }}
                                                    />
                                                </Stack>
                                            </TabPanel>
                                            : null
                                    }
                                </>
                            )
                    }


                </DialogContent>
                {
                    showEditEvent ? null
                        :
                        (
                            <DialogActions>
                                <Button size="large" onClick={handleCloseDialog}  >
                                    Cancelar
                                </Button>
                                <Button size="large" autoFocus onClick={handleSubmitDialog}>
                                    Guardar
                                </Button>
                            </DialogActions>
                        )
                }
            </BootstrapDialog>
        </>
    )
}

export default Schedule