import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
// @mui
import {
    Card,
    Table,
    Stack,
    Paper,
    TableRow,
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
    TextField,
    Button,
    DialogTitle,
    styled,
    Switch,
    FormControl,
    InputLabel,
    FormHelperText,
} from '@mui/material';

// components
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// date-fns
import { format } from 'date-fns';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
    { id: 'purchase_price', label: 'Costo de software', alignRight: false },
    { id: 'sale_price', label: 'Precio por hora', alignRight: false },
    { id: 'purchased_date', label: 'Fecha de compra', alignRight: false },
    { id: 'expiration_date', label: 'Fecha de vencimiento', alignRight: false },
    { id: 'active', label: 'Estado', alignRight: false },
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
        return filter(array, (_thread) => _thread.created_at.split('T')[0].toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const SoftwareUpdate = () => {

    /* Toastify */

    const showToastMessage = () => {
        toast.success('Actualización agregada con éxito!', {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    const showToastMessageStatus = (type, message) => {
        if (type === 'success') {
            toast.success(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        else {
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };

    /* React Form Hook */

    const { control, handleSubmit, reset, setValue, getValues, formState: { errors }, } = useForm({
        reValidateMode: 'onBlur'
    });


    /* Create - edit */
    const { id } = useParams();

    const [name, setName] = useState('');

    const [containerEstimatedValue, setContainerEstimatedValue] = useState(false);

    /* Datatable */

    const [softwaresUpdate, setSoftwaresUpdate] = useState([]);

    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleCreateDialog = (event) => {
        reset();
        setContainerEstimatedValue(false);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        reset();
    };

    /* Bug - date picker */
    const handleSubmitDialog = async (event) => {
        handleCloseDialog();
        await axios.post('/api/softwares-updates', {
            'softwares_id': id,
            'purchase_price': event.purchasePrice,
            'estimated_value': containerEstimatedValue ? event.estimatedValue : event.purchasePrice,
            'sale_price': event.salePrice,
            'purchased_date': format(new Date(event.purchasedDate), 'yyyy-MM-dd'),
            'expiration_date': format(new Date(event.expirationDate), 'yyyy-MM-dd'),
            'quantity': event.quantity,
        });
        showToastMessage();
        reset();
        getSoftwaresUpdate();
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

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const getSoftwaresUpdate = async () => {
        const response = await axios.get(`/api/softwares/${id}`);
        setSoftwaresUpdate(response.data.software_update);
        setName(response.data.name);
    }

    useEffect(() => {
        getSoftwaresUpdate();
    }, []);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - softwaresUpdate.length) : 0;

    const filteredSoftwares = applySortFilter(softwaresUpdate, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredSoftwares.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Gestión: Softwares | Fab Lab System </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Actualizaciones de {name}
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
                        Agregar actualización
                    </Button>
                </Stack>

                <Card>
                    <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar software..."} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SuppliesListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={softwaresUpdate.length}
                                    onRequestSort={handleRequestSort}
                                />
                                {/* Tiene que cargar primero... */}
                                {softwaresUpdate.length > 0 ? (
                                    <TableBody>
                                        {filteredSoftwares.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id: uuid, name, purchase_price: purchasePrice, sale_price: salePrice, purchased_date: purchasedDate, expiration_date: expirationDate, active } = row;

                                            return (
                                                <TableRow hover key={id} tabIndex={-1} role="checkbox">

                                                    <TableCell component="th" scope="row" padding="normal">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            $ {purchasePrice}
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        $ {salePrice}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        {purchasedDate}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        {expirationDate}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                                                            async () => {
                                                                if (active) (
                                                                    showToastMessageStatus('error', 'Actualización desactivada')
                                                                )
                                                                else (
                                                                    showToastMessageStatus('success', 'Actualización activada')
                                                                )
                                                                setSoftwaresUpdate(softwaresUpdate.map((software) => {
                                                                    if (software.id === uuid) {
                                                                        return { ...software, active: !active };
                                                                    }
                                                                    return software;
                                                                }));
                                                                await axios.put(`/api/softwares-updates/${uuid}`, {
                                                                    active: !active,
                                                                    'softwares_id': id,
                                                                });
                                                            }
                                                        } />
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
                        count={softwaresUpdate.length}
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
                    Gestión de Softwares
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Stack spacing={4} sx={{ minWidth: 550 }}>

                        <FormControl sx={{ width: '100%' }} error={!!errors?.purchasePrice}>
                            <InputLabel htmlFor="outlined-adornment-amount">Costo del software</InputLabel>
                            <Controller
                                name="purchasePrice"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'El costo del software es requerido',
                                    min: {
                                        value: 0,
                                        message: 'El costo del software debe ser mayor o igual a 0'
                                    },
                                    max: {
                                        value: 999999999,
                                        message: 'El costo del software debe ser menor o igual a 999999999'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value, } }) => (
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Costo del software"
                                        placeholder='0.00'
                                        size="small"
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e.target.value)
                                            if (parseFloat(e.target.value) === 0) {
                                                setContainerEstimatedValue(true)
                                            }
                                            else {
                                                setContainerEstimatedValue(false);
                                            }
                                        }}
                                        onBlur={onBlur}
                                        type="number"
                                        required
                                    />
                                )}
                            />
                            <FormHelperText>{errors.purchasePrice && errors.purchasePrice.message}</FormHelperText>
                        </FormControl>

                        {
                            containerEstimatedValue ?
                                (
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.estimatedValue}>
                                        <InputLabel htmlFor="outlined-adornment-amount">Costo estimado</InputLabel>
                                        <Controller
                                            name="estimatedValue"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: 'El costo estimado es requerido',
                                                min: {
                                                    value: 1,
                                                    message: 'El costo estimado debe ser mayor o igual a 1'
                                                },
                                                max: {
                                                    value: 100000,
                                                    message: 'El costo estimado debe ser menor o igual a 100000'
                                                }
                                            }}
                                            render={({ field: { onChange, onBlur, value, } }) => (
                                                <OutlinedInput
                                                    id="outlined-adornment-amount"
                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                    label="Costo estimado"
                                                    placeholder='0.00'
                                                    size="small"
                                                    value={value}
                                                    onChange={onChange}
                                                    onBlur={onBlur}
                                                    type="number"
                                                    required
                                                />
                                            )}
                                        />
                                        <FormHelperText>{errors.estimatedValue && errors.estimatedValue.message}</FormHelperText>
                                    </FormControl>
                                )
                                :
                                null
                        }

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Controller
                                name="purchasedDate"
                                control={control}
                                defaultValue={new Date()}
                                rules={{
                                    required: 'La fecha de compra es requerida'
                                }}
                                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Fecha de compra"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        required
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                size='small'
                                                error={!!error}
                                                helperText={error?.message}
                                            />}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <Controller
                                name="expirationDate"
                                control={control}
                                defaultValue={new Date()}
                                rules={{
                                    required: 'La fecha de expiración es requerida'
                                }}
                                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                                    <DatePicker
                                        label="Fecha de expiración"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        required
                                        renderInput={(params) =>
                                            <TextField
                                                {...params}
                                                size='small'
                                                error={!!error}
                                                helperText={error?.message}
                                            />}
                                    />
                                )}
                            />
                        </LocalizationProvider>

                        <FormControl sx={{ width: '100%' }} error={!!errors?.salePrice}>
                            <InputLabel htmlFor="outlined-adornment-amount">Precio por hora</InputLabel>
                            <Controller
                                name="salePrice"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'El precio por hora es requerido',
                                    min: {
                                        value: 1,
                                        message: 'El precio por hora debe ser mayor o igual a 1'
                                    },
                                    max: {
                                        value: 100000,
                                        message: 'El precio por hora debe ser menor o igual a 100000'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value, } }) => (
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Precio por hora"
                                        placeholder='0.00'
                                        size="small"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        type="number"
                                        required
                                    />
                                )}
                            />
                            <FormHelperText>{errors.salePrice && errors.salePrice.message}</FormHelperText>
                        </FormControl>


                        <FormControl sx={{ width: '100%' }}>
                            <Controller
                                name="quantity"
                                control={control}
                                defaultValue="1"
                                rules={{
                                    required: 'La cantidad es requerida',
                                    min: {
                                        value: 1,
                                        message: 'La cantidad debe ser mayor o igual a 1'
                                    },
                                    max: {
                                        value: 1000,
                                        message: 'La cantidad debe ser menor o igual a 1000'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                                    <TextField
                                        id="outlined-number"
                                        label="Cantidad"
                                        type="number"
                                        size="small"
                                        value={value}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        required
                                        error={!!error}
                                        helperText={error ? error.message : null}
                                    />
                                )}
                            />
                        </FormControl>

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button size="large" onClick={handleCloseDialog}  >
                        Cancelar
                    </Button>
                    <Button size="large" autoFocus onClick={handleSubmit(handleSubmitDialog)}>
                        Guardar
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )
}

export default SoftwareUpdate