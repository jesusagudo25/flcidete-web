import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter, set } from 'lodash';
import PropTypes, { func } from 'prop-types';
import axios from 'axios';
// @mui
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
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es';

import { Link } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import { TimePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import Slide from '@mui/material/Slide';

import Iconify from '../components/iconify';

import { getCalendarEvents } from '../sections/@dashboard/schedule/getCalendarEvents';
import config from '../config.json';


const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
        },
        '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
        },
        '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                theme.palette.getContrastText(theme.palette.primary.main),
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        width: 16,
        height: 16,
        margin: 2,
    },
}));

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

    /* Toastify */

    const showToastMessage = () => {
        if (!id) toast.success('Reservación agregada con éxito!', {
            position: toast.POSITION.TOP_RIGHT
        });
        else toast.success('Reservación actualizada con éxito!', {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    const showToastMessageChangeDay = (type, message) => {
        if (type === 'error') {
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        else {
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };

    /* useForm */
    const { control, handleSubmit, reset } = useForm({
        reValidateMode: 'onBlur'
    });

    /* Conteiner */
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const [showCreate, setShowCreate] = useState(false);
    const [showEditEvent, setShowEditEvent] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorExcel, setIsErrorExcel] = useState(false);
    const [errorsExcel, setErrorsExcel] = useState([]);
    const [isFormatExcel, setIsFormatExcel] = useState(false);

    /* Datos eventos */
    const [title, setTitle] = useState(''); // Título del evento
    const [eventCategory, setEventCategory] = useState(''); // Categoría del evento
    const [initialDate, setInitialDate] = useState(new Date()); // Fecha inicial del evento
    const [finalDate, setFinalDate] = useState(new Date()); // Fecha final del evento
    const [initialTime, setInitialTime] = useState(new Date()); // Hora inicial del evento
    const [finalTime, setFinalTime] = useState(new Date()); // Hora final del evento
    const [price, setPrice] = useState(0); // Precio del evento
    const [maxParticipants, setMaxParticipants] = useState(0); // Máximo de participantes
    const [status, setStatus] = useState(null);

    /* Customers */
    const [id, setId] = useState(null);
    const [containerTypeVisit, setContainerTypeVisit] = useState('I');
    const [documentType, setDocumentType] = useState('C');
    const [documentNumber, setDocumentNumber] = useState(null);
    const [name, setName] = useState(null);
    const [date, setDate] = useState(null);
    const [errors, setErrors] = useState({});

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
        setErrors({
            ...errors,
            areas: ''
        });
        setReasonSelected(event.target.value);
        flexibleHandleChangeReason(event.target.value);
    };

    const flexibleHandleChangeReason = (event) => {
        const selected = reasonVisits.find((reason) => reason.id === event);
        setAreasSelected(
            new Array(areas.length).fill(
                {
                    id: '',
                    visible: false,
                    timeIn: null,
                    timeOut: null
                }
            )
        );
        setCheckAll(
            {
                visible: false,
                timeIn: null,
                timeOut: null
            }
        );

        if (selected.isGroup) {
            setContainerCheckAll(true);
        }
        /* No es una visita libre */
        else {
            setContainerCheckAll(false);
        }
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                        timeOut: null
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
                        timeOut: null
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

    const handleCloseDialog = () => {
        setOpen(false);
        setId(null);
        setContainerTypeVisit('I');
        setDisabled(false);
        setId(null);
        setDocumentType('C');
        setDocumentNumber(null);
        setName(null);
        setDate(null);
        setReasonSelected(1);
        flexibleHandleChangeReason(1);
        setAreasSelected(
            areas.map((area) => {
                return {
                    id: '',
                    visible: false,
                    timeIn: null,
                    timeOut: null
                }
            }
            )
        );
        setCheckAll({
            visible: false,
            timeIn: null,
            timeOut: null
        });
        setSelectedFile(null);
        setValue(0);
        if (!open) setShowEditEvent(false);
    };

    const handleSubmitDialog = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const errorsDisplay = {};
        let flag = false;

        if (containerTypeVisit === 'G' && id === null) {
            if (selectedFile === null) {
                errorsDisplay.file = 'Debe seleccionar un archivo';
                flag = true;
            }
        }

        if (documentNumber === null || documentNumber === '') {
            errorsDisplay.document = 'Debe ingresar un número de documento';
            flag = true;
        }

        if (name === null || name === '') {
            errorsDisplay.name = 'Debe ingresar un nombre';
            flag = true;
        }

        const areasChecked = areasSelected.filter((area) => area.id !== '').map((area) => {
            return {
                area_id: area.id,
            }
        });

        if (areasChecked.length === 0 && containerCheckAll === false) {
            errorsDisplay.areas = 'Por favor, seleccione al menos un área';
            flag = true;
        }
        else if (areasChecked.length === 0 && containerCheckAll === true) {
            errorsDisplay.checkall = 'Por favor, complete el formulario';
            flag = true;
        }

        if (!flag) {
            setOpen(false);
            if (id) {
                await axios.post(`/api/bookings/put`, {
                    id,
                    'type': containerTypeVisit,
                    'document_type': documentType,
                    'document_number': documentNumber,
                    name,
                    date: format(date, 'yyyy-MM-dd'),
                    'reason_visit_id': reasonSelected,
                    areas: areasSelected.filter((area) => area.id !== '').map((area) => {
                        return {
                            area_id: area.id,
                            start_time: format(area.timeIn, 'HH:mm:ss'),
                            end_time: format(area.timeOut, 'HH:mm:ss')
                        }
                    }),
                    file: containerTypeVisit === 'G' ? selectedFile : null,
                    'status': status ? 'S' : 'P'
                },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json'
                        }
                    }
                )
                    .then((response) => {
                        setIsLoading(false);
                    })
            } else {
                await axios.post('/api/bookings', {
                    'type': containerTypeVisit,
                    'document_type': documentType,
                    'document_number': documentNumber,
                    name,
                    date: format(date, 'yyyy-MM-dd'),
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
                )
                    .then((response) => {
                        setIsLoading(false);
                        showToastMessage();
                        setShowEditEvent(false);
                        getCalendarEvents();
                        handleCloseDialog();
                    })
                    .catch((error) => {
                        if (error.response.data.type) {
                            setIsFormatExcel(true);
                        }
                        else {
                            setIsErrorExcel(true);
                            setErrorsExcel(error.response.data.errors);
                        }
                        setIsLoading(false);
                    }
                    )
            }

        } else {
            setErrors(errorsDisplay);
            
            if(errorsDisplay.document || errorsDisplay.name) {
                setValue(0);
            }
            else if (errorsDisplay.checkall || errorsDisplay.areas) {
                setValue(1);
            }
            else if (errorsDisplay.file) {
                setValue(2);
            }
            setIsLoading(false);
        }

    };

    /* Get api */
    const getAreas = async () => {
        const response = await axios.get('/api/areas')
        setIsLoading(false);
        setAreas(response.data);
        setAreasSelected(
            new Array(response.data.length).fill(
                {
                    id: '',
                    visible: false,
                    timeIn: null,
                    timeOut: null
                }
            )
        );
        setCheckAll(
            {
                visible: false,
                timeIn: null,
                timeOut: null
            }
        );
    }

    const getReasonVisits = async () => {
        const response = await axios.get('/api/reason-visits/bookings');
        setIsLoading(false);
        setReasonVisits(response.data);
    }

    useEffect(() => {
        setIsLoading(true);
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
                                setTitle(info.event.title);
                                setEventCategory(info.event.extendedProps.eventCategory);
                                setInitialDate(new Date(`${info.event.extendedProps.initial_date}T00:00:00`));
                                setFinalDate(new Date(`${info.event.extendedProps.final_date}T00:00:00`));
                                setInitialTime(parseISO(`${info.event.extendedProps.initial_date.split('T')[0]} ${info.event.extendedProps.initial_time}`));
                                setFinalTime(parseISO(`${info.event.extendedProps.final_date.split('T')[0]} ${info.event.extendedProps.final_time}`));
                                setPrice(info.event.extendedProps.price);
                                setMaxParticipants(info.event.extendedProps.quotas);
                                setOpen(true);
                            }
                            else {
                                setId(info.event.groupId);

                                setDocumentType(info.event.extendedProps.document_type);
                                setDocumentNumber(info.event.extendedProps.document_number);
                                setName(info.event.extendedProps.name);
                                setContainerTypeVisit(info.event.extendedProps.type);
                                setReasonSelected(info.event.extendedProps.reason_visit_id);
                                flexibleHandleChangeReason(info.event.extendedProps.reason_visit_id);
                                setDate(info.event.start);

                                if (info.event.extendedProps.areas.length < areas.length) {

                                    setAreasSelected(
                                        areasSelected.map((area, index) => {
                                            return {
                                                ...area,
                                                id: info.event.extendedProps.areas.find((item) => item.id === index + 1) ? info.event.extendedProps.areas.find((item) => item.id === index + 1).id : '',

                                                visible: info.event.extendedProps.areas.find((item) => item.id === index + 1),

                                                timeIn: info.event.extendedProps.areas.find((item) => item.id === index + 1) ? parseISO(`${info.event.startStr.split('T')[0]} ${info.event.extendedProps.areas.find((item) => item.id === index + 1).pivot.start_time}`) : null,

                                                timeOut: info.event.extendedProps.areas.find((item) => item.id === index + 1) ? parseISO(`${info.event.startStr.split('T')[0]} ${info.event.extendedProps.areas.find((item) => item.id === index + 1).pivot.end_time}`) : null
                                            }
                                        })
                                    );
                                }
                                else {
                                    const resul = info.event.extendedProps.areas.find((item) => item.id === 1)

                                    setCheckAll({
                                        timeIn: (parseISO(`${format(info.event.start, 'yyyy-MM-dd')} ${resul.pivot.start_time}`)),
                                        timeOut: (parseISO(`${format(info.event.start, 'yyyy-MM-dd')} ${resul.pivot.end_time}`)),
                                        visible: !checkAll.visible
                                    });

                                    if (!checkAll.visible) {
                                        setAreasSelected(
                                            areas.map((area) => {
                                                return {
                                                    id: area.id,
                                                    visible: false,
                                                    timeIn: (parseISO(`${format(info.event.start, 'yyyy-MM-dd')} ${resul.pivot.start_time}`)),
                                                    timeOut: (parseISO(`${format(info.event.start, 'yyyy-MM-dd')} ${resul.pivot.end_time}`))
                                                }
                                            })
                                        );

                                    }
                                }

                                if (info.event.extendedProps.status === 'D') {
                                    setDisabled(true);
                                    setStatus(false);
                                } else if (info.event.extendedProps.status === 'S') {
                                    setStatus(true);
                                    setDisabled(false);
                                } else {
                                    setStatus(false);
                                    setDisabled(false);
                                    if (info.event.start < new Date()) {
                                        setDisabled(true);
                                    }
                                }
                                setShowEditEvent(false);
                                setOpen(true);
                            }
                        }}
                        eventDrop={(info) => {
                            if (info.event.start < new Date()) {
                                info.revert();
                                showToastMessageChangeDay('error', 'No se puede cambiar la fecha de un evento que ya ha pasado.');
                            }
                            else {
                                showToastMessageChangeDay('success', 'Se ha cambiado la fecha del evento.');
                                axios.put(`/api/bookings/${info.event.groupId}`, {
                                    'date': format(info.event.start, 'yyyy-MM-dd')
                                });
                            }
                        }}
                        eventTimeFormat={{
                            hour: 'numeric',
                            minute: '2-digit',
                        }}
                        dateClick={(info) => {
                            setShowEditEvent(false);
                            if (info.dateStr >= new Date().toISOString().split('T')[0]) {
                                setOpen(true);
                                setDate(info.dateStr);
                                setDate(new Date(`${info.dateStr.toString()}T00:00:00`));
                                setShowCreate(true);
                            }
                        }}
                    />
                </Card>
            </Container>

            {/* Toastify */}

            <ToastContainer />

            {/* Feedback error visit format */}
            <Dialog
                open={isFormatExcel}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    setIsFormatExcel(false);
                    setOpen(true);
                }}
                aria-describedby="alert-dialog-slide-description"
                fullWidth
                maxWidth='sm'
            >
                <DialogContent dividers>

                    <Stack
                        direction="column"
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {/* Error X */}
                            <Iconify icon="mdi:close-circle" color="#FF4842" width="130px" height="130px" />
                        </Box>

                        <Typography variant="h4" sx={{
                            fontWeight: '600',
                            marginTop: 2,
                        }}>
                            Error al cargar el excel
                        </Typography>

                        <Typography variant="subtitle1" sx={{
                            fontWeight: '400',
                            marginTop: 2,
                            textAlign: 'justify',
                        }}>
                            No pudimos procesar su archivo debido a que no cumple con el formato correcto. Por favor, verifique los datos e intente nuevamente.
                        </Typography>


                    </Stack>

                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant="contained"
                        size='large'
                        sx={{
                            margin: 2,
                        }}
                        onClick={() => {
                            setIsFormatExcel(false);
                            setOpen(true);
                        }}
                    >Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Feedback error visit */}
            <Dialog
                open={isErrorExcel}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    setErrorsExcel([]);
                    setIsErrorExcel(false);
                    setOpen(true);
                }}
                aria-describedby="alert-dialog-slide-description"
                fullWidth
                maxWidth='sm'
            >
                <DialogContent dividers>

                    <Stack
                        direction="column"
                        sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {/* Error X */}
                            <Iconify icon="mdi:close-circle" color="#FF4842" width="130px" height="130px" />
                        </Box>

                        <Typography variant="h4" sx={{
                            fontWeight: '600',
                            marginTop: 2,
                        }}>
                            Error al cargar el excel
                        </Typography>

                        <Typography variant="subtitle1" sx={{
                            fontWeight: '400',
                            marginTop: 2,
                            textAlign: 'justify',
                        }}>
                            No pudimos procesar su archivo debido a uno o más errores. No se han creado clientes a partir de este archivo. Corrija los errores a continuación y vuelva a cargar el archivo para crear los clientes.
                            Para obtener más información sobre los <Box fontWeight='fontWeightMedium' display='inline'>requisitos de carga</Box>, consulte el <Box fontWeight='fontWeightMedium' display='inline'>manual de usuario</Box>.
                        </Typography>

                        {/* Errors Excel */}

                        <Stack
                            direction="column"
                            sx={{
                                marginTop: 1,
                                marginLeft: 6,
                                width: '100%',
                                lineHeight: '1.7',
                            }}
                        >
                            {
                                Object.keys(errorsExcel).map((key, index) => (
                                    <ul key={index}>
                                        <li>                                              {/* Name keys */}
                                            {`${key} es invalido en la fila: `}
                                            {/* Errors */}
                                            {errorsExcel[key].join(', ')}
                                        </li>
                                    </ul>
                                ))
                            }
                        </Stack>

                    </Stack>

                </DialogContent>
                <DialogActions
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant="contained"
                        size='large'
                        sx={{
                            margin: 2,
                        }}
                        onClick={() => {
                            setIsErrorExcel(false);
                            setErrorsExcel([]);
                            setOpen(true);
                        }}
                    >Cerrar</Button>
                </DialogActions>
            </Dialog>


            {/* Loading */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


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
                                        <TextField id="outlined-basic"
                                            variant="outlined"
                                            value={title}
                                            size="small"
                                            disabled
                                        />
                                    </FormControl>

                                    <FormControl sx={{ width: '48%' }}>
                                        <TextField id="outlined-basic" variant="outlined" value={eventCategory} size="small" disabled />
                                    </FormControl>

                                    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Fecha de inicio"
                                            value={initialDate}
                                            disabled
                                            inputFormat="dd/MM/yyyy"
                                            renderInput={(params) =>
                                                <TextField
                                                    size='small'
                                                    sx={{ width: '48%' }}
                                                    {...params}
                                                />}
                                        />
                                    </LocalizationProvider>

                                    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Fecha de finalización"
                                            value={finalDate}
                                            disabled
                                            renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                                            inputFormat="dd/MM/yyyy"
                                        />
                                    </LocalizationProvider>

                                    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                                        <TimePicker
                                            label="Hora de inicio"
                                            value={initialTime}
                                            disabled
                                            renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                                            ampm
                                            minTime={parseISO('2021-01-01T08:00:00')}
                                            maxTime={parseISO('2021-01-01T16:00:00')}
                                        />
                                    </LocalizationProvider>

                                    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                                        <TimePicker
                                            label="Hora de finalización"
                                            value={finalTime}
                                            disabled
                                            renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                                            ampm
                                            minTime={parseISO('2021-01-01T08:00:00')}
                                            maxTime={parseISO('2021-01-01T16:00:00')}
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
                                        <Tabs value={value} onChange={handleChange} aria-label="Customers-List">
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
                                                            disabled={disabled}
                                                        />
                                                        <FormControlLabel control={<Radio value="G" onChange={handleChangeTypeVisit}
                                                            checked={containerTypeVisit === 'G'} />}
                                                            label="Grupal"
                                                            disabled={disabled}
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
                                                    disabled={disabled}
                                                >
                                                    <MenuItem value={'C'}>Cédula</MenuItem>
                                                    <MenuItem value={'P'}>Pasaporte</MenuItem>
                                                    <MenuItem value={'R'}>RUC</MenuItem>
                                                </Select>
                                            </FormControl>

                                            <FormControl sx={{ width: '100%' }}>
                                                <TextField id="outlined-basic" label="Número de documento" variant="outlined" value={documentNumber} size="small" onChange={(event) => {
                                                    setDocumentNumber(event.target.value)
                                                    setErrors({ ...errors, document: '' })
                                                }}
                                                    disabled={disabled}
                                                    error={!!errors.document}
                                                    helperText={errors.document}
                                                />
                                            </FormControl>

                                            <FormControl sx={{ width: '100%' }}>
                                                <TextField id="outlined-basic" label="Nombre" variant="outlined" value={name} size="small" onChange={(event) => {
                                                    setName(event.target.value)
                                                    setErrors({ ...errors, name: '' })
                                                }} disabled={disabled}
                                                    error={!!errors.name}
                                                    helperText={errors.name}
                                                />
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
                                                    disabled={disabled}
                                                >
                                                    {
                                                        reasonVisits.map((item) => (
                                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>

                                            <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                                                <DatePicker
                                                    label="Fecha de visita"
                                                    value={date}
                                                    onChange={(newValue) => {
                                                        setDate(newValue);
                                                    }}
                                                    inputFormat="dd/MM/yyyy"
                                                    disablePast
                                                    renderInput={(params) => <TextField size='small' {...params} />}
                                                    disabled
                                                />
                                            </LocalizationProvider>

                                            {
                                                id ?
                                                    <FormControlLabel
                                                        control={<Android12Switch defaultChecked />}
                                                        label="Estado"
                                                        checked={status}
                                                        onChange={(event) => {
                                                            setStatus(event.target.checked)
                                                        }}
                                                        disabled={disabled}
                                                    />
                                                    :
                                                    null
                                            }

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
                                                                onChange={() => {
                                                                    handleSelectedAreas(index)
                                                                    setErrors({ ...errors, areas: '' })
                                                                }}
                                                                disabled={containerCheckAll || disabled}

                                                            />
                                                        }
                                                        label={area.name}
                                                    />

                                                    {areasSelected[index].visible ? (
                                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: '10px' }} >
                                                            <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns} >
                                                                <TimePicker
                                                                    label="Hora de entrada"
                                                                    renderInput={(params) => <TextField {...params}
                                                                        size="small"
                                                                        sx={{ width: '25%', marginLeft: '10px', }}
                                                                        InputLabelProps={{ shrink: true }}
                                                                    />}
                                                                    value={areasSelected[index].timeIn}
                                                                    onChange={(newValue) => {
                                                                        handleChangeTimeIn(index, newValue);
                                                                    }}
                                                                    ampm
                                                                    minTime={parseISO('2021-01-01T08:00:00')}
                                                                    maxTime={parseISO('2021-01-01T16:00:00')}
                                                                    disabled={disabled}
                                                                />
                                                            </LocalizationProvider>

                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: 'primary.main',
                                                                    color: 'primary.contrastText',
                                                                    width: 32,
                                                                    height: 32,
                                                                }}
                                                            >
                                                                <Iconify icon="bi:arrow-right" />
                                                            </Avatar>

                                                            <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                                                                <TimePicker
                                                                    label="Hora de salida"
                                                                    renderInput={(params) => <TextField {...params}
                                                                        size="small"
                                                                        sx={
                                                                            {
                                                                                width: '25%',
                                                                            }
                                                                        }
                                                                        InputLabelProps={{ shrink: true }}
                                                                    />}
                                                                    value={areasSelected[index].timeOut}
                                                                    onChange={(newValue) => {
                                                                        handleChangeTimeOut(index, newValue);
                                                                    }}
                                                                    ampm
                                                                    minTime={parseISO('2021-01-01T08:00:00')}
                                                                    maxTime={parseISO('2021-01-01T16:00:00')}
                                                                    disabled={disabled}
                                                                />
                                                            </LocalizationProvider>
                                                        </Stack>
                                                    ) : null}
                                                </Stack>
                                            ))}

                                            <FormHelperText
                                                sx={{
                                                    color: '#FF4842',
                                                    marginTop: '10px',
                                                }}
                                            >{errors.areas ? errors.areas : null}</FormHelperText>

                                            {
                                                containerCheckAll ?
                                                    <Stack direction="row" alignItems="center" sx={{ marginTop: '3px' }}>
                                                        <Iconify icon="bi:arrow-right"
                                                            color="primary"
                                                            sx={{ cursor: 'pointer', fontSize: '20px', marginLeft: '5px' }} />
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox name="Marcar todas"
                                                                    checked={checkAll.visible}
                                                                    onChange={
                                                                        (e) => {
                                                                            handleChangeCheckAll(e)
                                                                            setErrors({ ...errors, checkall: '' })
                                                                        }
                                                                    } />}
                                                            sx={{ marginLeft: '3px' }}
                                                            label="Marcar todas"
                                                            disabled={disabled} />

                                                        {checkAll.visible ? (

                                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ margin: '10px' }} >

                                                                <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns} >
                                                                    <TimePicker
                                                                        label="Hora de entrada"
                                                                        renderInput={(params) =>
                                                                            <TextField {...params}
                                                                                size="small" sx={{ width: '25%', marginLeft: '10px', }}
                                                                                InputLabelProps={{ shrink: true }} />}
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
                                                                        width: 32,
                                                                        height: 32,
                                                                    }}
                                                                >
                                                                    <Iconify icon="bi:arrow-right" />
                                                                </Avatar>

                                                                <LocalizationProvider
                                                                    adapterLocale={es}
                                                                    dateAdapter={AdapterDateFns}>
                                                                    <TimePicker
                                                                        label="Hora de salida"
                                                                        renderInput={(params) => <TextField {...params}
                                                                            size="small"
                                                                            sx={{ width: '25%', }}
                                                                            InputLabelProps={{ shrink: true }}
                                                                        />}
                                                                        value={checkAll.timeOut}
                                                                        onChange={(newValue) => {
                                                                            handleChangeTimeOutCheckAll(newValue);
                                                                        }}
                                                                        ampm
                                                                        minTime={parseISO('2021-01-01T08:00:00')}
                                                                        maxTime={parseISO('2021-01-01T16:00:00')}
                                                                        disabled={disabled}
                                                                    />
                                                                </LocalizationProvider>
                                                            </Stack>
                                                        ) : null}

                                                    </Stack>

                                                    : null
                                            }
                                            <FormHelperText
                                                sx={{
                                                    color: '#FF4842',
                                                    marginTop: '10px',
                                                }}
                                            >{errors.checkall ? errors.checkall : null}</FormHelperText>
                                        </Stack>
                                    </TabPanel>
                                    {
                                        containerTypeVisit === 'G' ?
                                            <TabPanel value={value} index={2}>

                                                <Stack spacing={2.5}>
                                                    {
                                                        id ?
                                                            (
                                                                <>
                                                                    <FormLabel id="customer-list"
                                                                    >Actualizar lista de visitantes</FormLabel>
                                                                </>
                                                            )
                                                            : null
                                                    }
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <a
                                                            href={`${config.APPBACK_URL}/api/customers/download`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download
                                                            style={
                                                                {
                                                                    textDecoration: 'none',
                                                                    color: 'inherit',
                                                                }
                                                            }
                                                            disabled={disabled}
                                                        >
                                                            <Button variant="contained"
                                                                size='medium'
                                                                sx={{
                                                                    width: '180px',
                                                                }}
                                                                disabled={disabled}
                                                            >
                                                                Descargar</Button>
                                                        </a>

                                                        <Avatar
                                                            sx={{
                                                                bgcolor: 'primary.main',
                                                                color: 'primary.contrastText',
                                                            }}
                                                        >
                                                            <Iconify icon="bi:arrow-right" />
                                                        </Avatar>
                                                        {/* Input file blue */}
                                                        <FormControl sx={{ width: '35%' }}>
                                                            <Input
                                                                accept=".xlsx"
                                                                type="file"
                                                                onChange={(e) => {
                                                                    if (e.target.files[0].type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                                                                        setSelectedFile(e.target.files[0]);
                                                                        setErrors({ ...errors, file: '' });
                                                                    }
                                                                    else {
                                                                        alert('Formato no válido');
                                                                        setSelectedFile(null);
                                                                    }
                                                                }}
                                                                disabled={disabled}
                                                            />
                                                            <FormHelperText
                                                                sx={{
                                                                    color: '#FF4842',
                                                                }}
                                                            >{
                                                                    errors.file ? errors.file : ''
                                                                }</FormHelperText>
                                                        </FormControl>
                                                    </Stack>

                                                    {id ? (
                                                        <>
                                                            <FormLabel id="show-list">Lista de visitantes </FormLabel>
                                                            <Stack
                                                                direction="row"
                                                                spacing={2}
                                                                alignItems="center"
                                                                justifyContent="center"
                                                            >
                                                                <a
                                                                    href={`${config.APPBACK_URL}/api/bookings/${id}/customers/pdf/`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    download
                                                                    style={{ textDecoration: 'none' }}
                                                                >
                                                                    <Button variant="contained"
                                                                        size='medium'
                                                                        sx={{
                                                                            width: '180px',
                                                                        }}
                                                                        color="error"
                                                                        startIcon={<Iconify icon="mdi:file-pdf" />}
                                                                    >
                                                                        Descargar PDF
                                                                    </Button>
                                                                </a>
                                                            </Stack>
                                                        </>
                                                    )
                                                        : null
                                                    }
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