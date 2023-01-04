import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
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
    InputLabel,
    Select,
} from '@mui/material';

// components
import { Link, useParams } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloseIcon from '@mui/icons-material/Close';

// date-fns
import { format, lastDayOfMonth, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections - Se debe reempazar el nombre del componente por uno mas general
import { VisitsAreasListHead, VisitsAreasToolbar } from '../../@dashboard/visits';

const TABLE_HEAD = [
    { id: 'area', label: 'Área', alignRight: false },
    { id: 'start_time', label: 'Hora de inicio', alignRight: false },
    { id: 'end_time', label: 'Hora de salida', alignRight: false },
    { id: '' },
];

/* --------------------> */

const ButtonSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
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

/* -------------------> */

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_area) => _area.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const VisitsAreas = () => {

    /* Toastify */
    const showToastMessageStatus = (type, message) => {
        if (type === 'success') {
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        else if (type === 'error') {
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        else if (type === 'warning') {
            toast.warn(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        else {
            toast.info(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };


    /* Datatable */
    const { id } = useParams()

    const [area, setArea] = useState(''); /* Area seleccionada */
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());

    const [areas, setAreas] = useState([]); /* Areas visitadas */

    const [listAreas, setListAreas] = useState([]); /* Lista de areas para agregar */

    const [open, setOpen] = useState(false);
    const [openPopper, setOpenPopper] = useState(null);
    const [editAll, setEditAll] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [itemSelected, setItemSelected] = useState({
        areaId: '',
        startTime: '',
        endTime: '',
        createdA: '',
    });

    const [orderBy, setOrderBy] = useState('date');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleCreateDialog = (event) => {
        setArea('');
        setStartTime(new Date());
        setEndTime(new Date());
        const resul = listAreas.filter((a1) => !areas.some((a2) => a2.id === a1.id));
        setListAreas(resul);
        setSelected([]);
        if (resul.length === 0) alert('No hay areas disponibles');
        else setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setEditAll(false);
    };

    const handleCloseMenu = () => {
        setOpenPopper(null);
        setItemSelected({
            areaId: '',
            startTime: '',
            endTime: '',
            createdA: '',
        });
    };

    const handleSubmitDialog = async (event) => {
        event.preventDefault();
        if (editAll) {
            const areas = selected.map((area) => {
                return {
                    area_id: area,
                    'start_time': format(startTime, 'HH:mm:ss'),
                    'end_time': endTime ? format(endTime, 'HH:mm:ss') : null,
                }
            });
            await axios.post('api/visits/areas/update', {
                visit_id: id,
                areas,
            });
            showToastMessageStatus('success', 'Se actualizaron las áreas de visita correctamente');
        }
        else if (itemSelected.areaId) {
            await axios.put(`/api/visits/${id}/areas`, {
                area_id: itemSelected.areaId,
                'start_time': format(startTime, 'HH:mm:ss'),
                'end_time': endTime ? format(endTime, 'HH:mm:ss') : null,
            });
            showToastMessageStatus('success', 'Se actualizo el área de visita correctamente');
        } else {
            await axios.post('/api/visits/areas', {
                visit_id: id,
                area_id: area,
                'start_time': format(startTime, 'HH:mm:ss'),
                'end_time': endTime ? format(endTime, 'HH:mm:ss') : null,
            });
            showToastMessageStatus('success', 'Se agrego el área de visita correctamente');
        }
        setEditAll(false);
        setItemSelected({
            areaId: '',
            startTime: '',
            endTime: '',
            createdA: '',
        });
        handleCloseDialog();
        getAreas();
        setSelected([]);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = areas.map((n) => n.id.toString());
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const getListAreas = async () => {
        const response = await axios.get(`/api/areas`);
        setListAreas(response.data);
    }

    const getAreas = async () => {
        const response = await axios.get(`/api/visits/${id}/areas`);
        setAreas(response.data);
    }

    useEffect(() => {
        getAreas();
        getListAreas();
    }, []);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - areas.length) : 0;

    const filteredAreas = applySortFilter(areas, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredAreas.length && !!filterName;


    return (
        <>
            <Helmet>
                <title> Gestión: Áreas | Fab Lab System </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Áreas visitadas
                    </Typography>

                    <Button variant="contained" onClick={handleCreateDialog}>
                        Agregar Áreas
                    </Button>
                </Stack>

                <Card>
                    <VisitsAreasToolbar setOpen={setOpen} setEditAll={setEditAll} setStartTime={setStartTime} setEndTime={setEndTime} selected={selected} setItemSelected={setItemSelected} setSelected={setSelected} getAreas={getAreas} getListAreas={getListAreas} id={id} numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <VisitsAreasListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={areas.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                {/* Tiene que cargar primero... */}
                                {areas.length > 0 ? (
                                    <TableBody>
                                        {filteredAreas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id: areaId, name, start_time: startTime, end_time: endTime, created_at: createdAt } = row;
                                            const selectedArea = selected.indexOf(areaId.toString()) !== -1;

                                            return (
                                                <TableRow hover key={areaId} tabIndex={-1} role="checkbox">
                                                    <TableCell padding="checkbox">
                                                        <Checkbox checked={selectedArea} onChange={(event) => handleClick(event, areaId.toString())} />
                                                    </TableCell>

                                                    <TableCell component="th" scope="row" padding="normal">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {format(parseISO(`${createdAt.split('T')[0]} ${startTime}`), 'h:mm a', { locale: es })}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        {endTime ? format(parseISO(`${createdAt.split('T')[0]} ${endTime}`), 'h:mm a', { locale: es }) : 'Sin finalizar'}
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <IconButton size="large" color="inherit" onClick={(event) => {
                                                            setSelected([]);
                                                            setItemSelected({
                                                                areaId,
                                                                startTime,
                                                                endTime,
                                                                createdAt
                                                            });
                                                            setOpenPopper(event.currentTarget);
                                                        }}>
                                                            <Iconify icon={'eva:more-vertical-fill'} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow style={{ height: 53 * emptyRows }}>
                                                <TableCell colSpan={6} />
                                            </TableRow>
                                        )}
                                    </TableBody>
                                )
                                    :
                                    (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                    <Paper
                                                        sx={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        <Typography variant="h6" paragraph>
                                                            No se han encontrado resultados
                                                        </Typography>

                                                        <Typography variant="body2">
                                                            Por favor&nbsp;
                                                            <strong>recarga</strong> la página.
                                                        </Typography>
                                                    </Paper>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )
                                }


                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        No se ha encontrado
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No se han encontrado resultados para &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Intenta revisar las faltas o utilizar palabras completas.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                        count={areas.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            {/* Toastify */}

            <ToastContainer />


            {/* Dialog */}

            <BootstrapDialog
                onClose={handleCloseDialog}
                aria-labelledby="customized-dialog-title"
                open={open}
                maxWidth='sm'
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
                    Gestión de Áreas
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ minWidth: 550 }}>

                        {
                            editAll === false && itemSelected.areaId === '' ? (
                                <FormControl size="small">
                                    <InputLabel id="category-select-label">Área visitada</InputLabel>
                                    <Select
                                        labelId="category-select-label"
                                        id="category-select"
                                        value={area}
                                        label="Área visitada"
                                        onChange={(e) => {
                                            setArea(e.target.value)
                                        }}

                                        required
                                    >
                                        {
                                            listAreas.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            )
                                : null


                        }


                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                            <TimePicker
                                label="Hora de entrada"
                                value={startTime}
                                onChange={(newValue) => {
                                    setStartTime(newValue)
                                }}
                                renderInput={(params) => <TextField size='small' {...params} />}
                                ampm
                                minTime={parseISO('2021-01-01T08:00:00')}
                                maxTime={parseISO('2021-01-01T16:00:00')}
                            />
                        </LocalizationProvider>

                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                            <TimePicker
                                label="Hora de salida"
                                value={endTime}
                                onChange={(newValue) => {
                                    setEndTime(newValue);
                                }}
                                renderInput={(params) => <TextField size='small' {...params} />}
                                ampm
                                minTime={parseISO('2021-01-01T08:00:00')}
                                maxTime={parseISO('2021-01-01T16:00:00')}
                            />
                        </LocalizationProvider>

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button size="large" onClick={handleCloseDialog}  >
                        Cancelar
                    </Button>
                    <Button size="large" autoFocus onClick={handleSubmitDialog}>
                        Guardar
                    </Button>
                </DialogActions>
            </BootstrapDialog>

            {/* Popper */}

            <Popover
                open={Boolean(openPopper)}
                anchorEl={openPopper}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        width: 140,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <MenuItem onClick={
                    () => {
                        setStartTime((parseISO(`${itemSelected.createdAt.split('T')[0]} ${itemSelected.startTime}`)));
                        setEndTime((
                            itemSelected.endTime === null ? null : parseISO(`${itemSelected.createdAt.split('T')[0]} ${itemSelected.endTime}`)
                        ));
                        setOpen(true);
                    }
                }>
                    <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                    Editar
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }} onClick={
                    async () => {
                        setOpenPopper(null);
                        setAreas(areas.filter((area) => area.id !== itemSelected.areaId));
                        await axios.get(`/api/visits/${id}/area/${itemSelected.areaId}`);
                        getAreas();
                        getListAreas();
                        setEditAll(false);
                        setItemSelected({
                            areaId: '',
                            startTime: '',
                            endTime: '',
                            createdA: '',
                        });
                    }
                }>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Borrar
                </MenuItem>
            </Popover>
        </>
    )
}

export default VisitsAreas