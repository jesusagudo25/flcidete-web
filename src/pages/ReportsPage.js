import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

// components
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// date-fns
import { format, lastDayOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// date-fns

// sections
import { ReportListHead, ReportListToolbar } from '../sections/@dashboard/report';
import config from '../config.json';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'month', label: 'Mes', alignRight: false },
    { id: 'type', label: 'Tipo', alignRight: false },
    { id: 'user', label: 'Usuario', alignRight: false },
    { id: 'start_date', label: 'Fecha de inicio', alignRight: false },
    { id: 'end_date', label: 'Fecha de finalización', alignRight: false },
    { id: '' },
];

const options = [
    {
        value: 'g',
        label: 'General',
    },
    {
        value: 'c',
        label: 'Ingresos y Egresos',
    },
    {
        value: 'v',
        label: 'Visitas',
    },
];

// ----------------------------------------------------------------------

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
        return filter(array, (_report) => _report.start_date.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ReportsPage = () => {

    /* Notify */

    const showToastMessage = () => {
        toast.error('Reporte eliminado!', {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    /* Reports */

    const [report, setReport] = useState(null);

    const [reports, setReports] = useState([]);

    const [open, setOpen] = useState(null);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('desc');

    const [orderBy, setOrderBy] = useState('id');

    const [filterDate, setFilterDate] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [itemSelected, setItemSelected] = useState(null);

    const [startDate, setStartDate] = useState(new Date(`${format(new Date(), 'yyyy-MM-01')}T00:00:00`));

    const [endDate, setEndDate] = useState(new Date(`${format(new Date(), 'yyyy-MM-dd')}T00:00:00`));

    const [isLoading, setIsLoading] = useState(false);

    const [isComplete, setIsComplete] = useState(false);

    const [openDialogType, setOpenDialogType] = useState(false);

    const [radioSelected, setRadioSelected] = useState('g');

    const radioGroupRef = React.useRef(null);

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleFilterByDate = (event) => {
        setPage(0);
        setFilterDate(event.target.value);
    };

    const handleStartDateChange = (newValue) => {
        setStartDate(newValue);
    };

    const handleEndDateChange = (newValue) => {
        setEndDate(newValue);
    };

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleChangeRadioType = (event) => {
        setRadioSelected(event.target.value);
    };

    const getReports = () => {
        axios.get('/api/reports')
            .then((response) => {
                setReports(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            }
            );
    };

    useEffect(() => {
        setIsLoading(true);
        getReports();
    }, []);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reports.length) : 0;

    const filteredReports = applySortFilter(reports, getComparator(order, orderBy), filterDate);

    const isNotFound = !filteredReports.length && !!filterDate;

    return (
        <>
            <Helmet>
                <title> Formulario: Reportes | Fab Lab System </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Generar
                </Typography>

                <Card>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ paddingLeft: 3, paddingTop: 3, paddingBottom: 2 }}>
                        <Typography variant="subtitle1">
                            Rango de fechas
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ paddingX: 3, paddingBottom: 3 }}>
                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Fecha de inicio"
                                value={startDate}
                                onChange={handleStartDateChange}
                                inputFormat="dd/MM/yyyy"
                                renderInput={(params) => <TextField sx={
                                    {
                                        width: '30%',
                                    }
                                } {...params} />}
                            />
                        </LocalizationProvider>
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                            }}
                        >
                            <Iconify icon="bx:bxs-calendar" />
                        </Avatar>

                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Fecha de finalización"
                                value={endDate}
                                inputFormat="dd/MM/yyyy"
                                onChange={handleEndDateChange}
                                renderInput={(params) => <TextField sx={
                                    {
                                        width: '30%',
                                    }
                                } {...params} />}
                            />
                        </LocalizationProvider>
                        <LoadingButton variant="contained" color="primary" size="large" loading={isLoading} sx={{ ml: 1, width: '15%' }} onClick={
                            () => {
                                setOpenDialogType(true);
                                setIsLoading(true);
                            }
                        }>
                            Generar
                        </LoadingButton>
                    </Stack>
                </Card>

                <Typography variant="h4" sx={{ my: 5 }}>
                    Reportes
                </Typography>

                <Card>
                    <ReportListToolbar filterDate={filterDate} onFilterDate={handleFilterByDate} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <ReportListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={reports.length}
                                    onRequestSort={handleRequestSort}
                                />
                                {/* Tiene que cargar primero... */}
                                {reports.length > 0 ? (
                                    <TableBody>
                                        {filteredReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id, user, month, start_date: startDate, end_date: endDate, type } = row;

                                            return (
                                                <TableRow hover key={id} tabIndex={-1} role="checkbox">

                                                    <TableCell component="th" scope="row" padding="normal">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {month}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Label color={type === 'g' ? 'success' : type === 'v' ? 'warning' : 'error'}>{sentenceCase(type === 'g' ? 'General' : type === 'v' ? 'Visitas' : 'Insumos')}</Label>
                                                    </TableCell>
                                                    <TableCell align="left">{user.name}</TableCell>

                                                    <TableCell align="left">{startDate}</TableCell>

                                                    <TableCell align="left">{endDate}</TableCell>

                                                    <TableCell align="right">
                                                        <IconButton size="large" color="inherit" onClick={(event) => {
                                                            setItemSelected(id);
                                                            setOpen(event.currentTarget);
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
                                                        <strong>&quot;{filterDate}&quot;</strong>.
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
                        count={reports.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>

            {/* Toastify */}

            <ToastContainer />

            {/* Dialog - report result */}
            <Dialog
                open={isComplete}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => {
                    setIsComplete(false);
                    setStartDate(new Date(`${format(new Date(), 'yyyy-MM-01')}T00:00:00`));
                    setEndDate(new Date(`${format(new Date(), 'yyyy-MM-dd')}T00:00:00`));
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
                            <Iconify icon="mdi:check-circle" color="#4caf50" width="130px" height="130px" />
                        </Box>

                        <Stack
                            direction="row"
                            sx={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                gap: 1,
                                marginTop: 1,
                            }}
                        >
                            {/* Details */}
                            <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>Mes seleccionado:</Typography>
                            {
                                report ? <Typography variant="subtitle1" sx={{ fontWeight: '600' }}>{report.month}</Typography> : null
                            }
                        </Stack>

                        <Typography variant="h4" sx={{
                            fontWeight: '600',
                            marginTop: 2,
                        }}>Reporte generado correctamente</Typography>

                        <Typography variant="h6" sx={{
                            marginY: 2,
                            fontWeight: '400'
                        }}>¿Desea descargarlo?</Typography>
                        {
                            report ?
                                <a
                                    href={`${config.APPBACK_URL}/api/reports/${report.id}/pdf/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Button variant="contained"
                                        size='large'
                                        sx={{
                                            width: '100%',
                                        }}
                                        color="error"
                                        startIcon={<Iconify icon="mdi:file-pdf" />}
                                    >
                                        Descargar
                                    </Button>
                                </a>
                                : null
                        }
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
                            setIsComplete(false);
                        }}
                    >Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog - select type report */}
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                maxWidth="xs"
                TransitionProps={{ onEntering: handleEntering }}
                open={openDialogType}
            >
                <DialogTitle>Tipo de reporte</DialogTitle>
                <DialogContent dividers>
                    <RadioGroup
                        ref={radioGroupRef}
                        aria-label="reporttype"
                        name="reporttype"
                        value={radioSelected}
                        onChange={handleChangeRadioType}
                    >
                        {options.map((option) => (
                            <FormControlLabel
                                value={option.value}
                                key={option.value}
                                control={<Radio />}
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => {
                        setOpenDialogType(false);
                        setIsLoading(false);
                    }}>
                        Cancelar
                    </Button>
                    <Button onClick={() => {
                        setIsLoading(true);
                        axios.post('/api/reports', {
                            start_date: format(startDate, 'yyyy-MM-dd'),
                            end_date: format(endDate, 'yyyy-MM-dd'),
                            type: radioSelected,
                            user_id: localStorage.getItem('id'),
                        })
                            .then((response) => {
                                if (response.data.success) {
                                    setReport(response.data.report);
                                    setIsLoading(false);
                                    getReports();
                                    setOpenDialogType(false);
                                    setIsComplete(true);
                                    setIsLoading(false);
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            }
                            );
                    }}>Seleccionar</Button>
                </DialogActions>
            </Dialog>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Popover
                open={Boolean(open)}
                anchorEl={open}
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
                <MenuItem
                    component={"a"}
                    href={`${config.APPBACK_URL}/api/reports/${itemSelected}/pdf/`}
                    target="_blank"
                >
                    <Iconify icon={'mdi:file-pdf'} sx={{ mr: 2 }} />
                    PDF
                </MenuItem>

                <MenuItem sx={{ color: 'error.main' }} onClick={
                    () => {
                        showToastMessage();
                        setOpen(null);
                        setReports(reports.filter((report) => report.id !== itemSelected));
                        axios.delete(`${config.APPBACK_URL}/api/reports/${itemSelected}/`);
                    }
                }>
                    <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                    Eliminar
                </MenuItem>
            </Popover>
        </>
    );
}

export default ReportsPage