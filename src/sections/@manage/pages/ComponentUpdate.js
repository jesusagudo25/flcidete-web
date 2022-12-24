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
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// date-fns
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
    { id: 'name', label: 'Nombre', alignRight: false },
    { id: 'purchase_price', label: 'Costo de software', alignRight: false },
    { id: 'sale_price', label: 'Precio por hora', alignRight: false },
    { id: 'expiration_date', label: 'Fecha de vencimiento', alignRight: false },
    { id: 'active', label: 'Estado', alignRight: false },
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
        return filter(array, (_thread) => _thread.created_at.split('T')[0].toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const ComponentUpdate = () => {

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

    const [estimatedValue, setEstimatedValue] = useState('');

    const [purchasePrice, setPurchasePrice] = useState('');

    const [salePrice, setSalePrice] = useState('');

    const [stock, setStock] = useState('');

    const [percentage, setPercentage] = useState('');

    const [containerEstimatedValue, setContainerEstimatedValue] = useState(false);

    /* Datatable */

    const [componentsUpdate, setComponentsUpdate] = useState([]);

    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);


    const handleCalculateSalePrice = (purchasePrice, estimatedValue, percentage) => {
        const valor = purchasePrice > 0 ? purchasePrice : estimatedValue;
        if (valor > 0 && percentage > 0) {
            const value = parseFloat(valor) + (valor * percentage / 100);
            setValue('salePrice', (parseFloat(value).toFixed(2)));
        }
        else {
            setValue('salePrice', (parseFloat(0).toFixed(2)));
        }
    };

    const handleCreateDialog = (event) => {
        /*         setEstimatedValue('');
                setPurchasePrice('');
                setSalePrice('');
                setStock('');
                setPercentage(''); */
        reset();
        setContainerEstimatedValue(false);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        reset();
    };

    const handleSubmitDialog = async (event) => {
        handleCloseDialog();
        await axios.post('/api/component-updates', {
            'component_id': id,
            'purchase_price': event.purchasePrice,
            'estimated_value': containerEstimatedValue ? event.estimatedValue : event.purchasePrice,
            'percentage': event.percentage,
            'sale_price': event.salePrice,
            'quantity': event.stock,
        });
        showToastMessage();
        getComponentsUpdate();
        reset();
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

    const getComponentsUpdate = async () => {
        const response = await axios.get(`/api/components/${id}`);
        setComponentsUpdate(response.data.component_updates);
        setName(response.data.name);
    }

    useEffect(() => {
        getComponentsUpdate();
    }, []);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - componentsUpdate.length) : 0;

    const filteredComponentsUpdate = applySortFilter(componentsUpdate, getComparator(order, orderBy), filterName);

    const isNotFound = !filteredComponentsUpdate.length && !!filterName;

    return (
        <>
            <Helmet>
                <title> Gestión: Componentes | Fab Lab System </title>
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
                    <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar actualización..."} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <SuppliesListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={componentsUpdate.length}
                                    onRequestSort={handleRequestSort}
                                />
                                {/* Tiene que cargar primero... */}
                                {componentsUpdate.length > 0 ? (
                                    <TableBody>
                                        {filteredComponentsUpdate.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id: uuid, purchase_price: purchasePrice, estimated_value: estimatedValue, percentage, sale_price: salePrice, quantity, created_at: createdAt, active } = row;

                                            return (
                                                <TableRow hover key={uuid} tabIndex={-1} role="checkbox">

                                                    <TableCell component="th" scope="row" padding="normal">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            $ {purchasePrice}
                                                        </Stack>
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        {quantity}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        % {percentage}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        $ {salePrice}
                                                    </TableCell>

                                                    <TableCell align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {createdAt.split('T')[0]}
                                                        </Typography>
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
                                                                setComponentsUpdate(componentsUpdate.map((component) => {
                                                                    if (component.id === uuid) {
                                                                        return { ...component, active: !active };
                                                                    }
                                                                    return component;
                                                                }));
                                                                await axios.put(`/api/component-updates/${uuid}`, {
                                                                    active: !active,
                                                                    'component_id': id,
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
                        count={componentsUpdate.length}
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
                    Gestión de actualizaciones
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ minWidth: 550 }}>

                        <FormControl sx={{ width: '100%' }} error={!!errors?.purchasePrice}>
                            <InputLabel htmlFor="outlined-adornment-amount">Costo de componente</InputLabel>
                            <Controller
                                name="purchasePrice"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'El costo de componente es requerido',
                                    min: {
                                        value: 0,
                                        message: 'El costo de componente debe ser mayor o igual a 0'
                                    },
                                    max: {
                                        value: 999999999,
                                        message: 'El costo de componente debe ser menor o igual a 999999999'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value, } }) => (
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Costo de componente"
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
                                            handleCalculateSalePrice(e.target.value, getValues('estimatedValue'), getValues('percentage'))
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
                                                    onChange={(e) => {
                                                        onChange(e.target.value);
                                                        handleCalculateSalePrice(getValues('purchasePrice'), e.target.value, getValues('percentage'))
                                                    }}
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

                        <FormControl sx={{ width: '100%' }}>
                            <Controller
                                name="stock"
                                control={control}
                                defaultValue="1"
                                rules={{
                                    required: 'El stock es requerido',
                                    min: {
                                        value: 1,
                                        message: 'El stock debe ser mayor o igual a 1'
                                    },
                                    max: {
                                        value: 100000,
                                        message: 'El stock debe ser menor o igual a 100000'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                                    <TextField
                                        id="outlined-basic"
                                        label="Stock"
                                        variant="outlined"
                                        size="small"
                                        type="number"
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

                        <FormControl sx={{ width: '100%' }} error={!!errors?.percentage}>
                            <InputLabel htmlFor="outlined-adornment-amount">Porcentaje de ganancia</InputLabel>
                            <Controller
                                name="percentage"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'El porcentaje de ganancia es requerido',
                                    min: {
                                        value: 1,
                                        message: 'El porcentaje de ganancia debe ser mayor o igual a 1'
                                    },
                                    max: {
                                        value: 100,
                                        message: 'El porcentaje de ganancia debe ser menor o igual a 100'
                                    }
                                }}
                                render={({ field: { onChange, onBlur, value, } }) => (
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                        label="Porcentaje de ganancia"
                                        placeholder='0'
                                        size="small"
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e.target.value);
                                            handleCalculateSalePrice(getValues('purchasePrice'), getValues('estimatedValue'), e.target.value)
                                        }}
                                        onBlur={onBlur}
                                        type="number"
                                        required
                                    />
                                )}
                            />
                            <FormHelperText>{errors.percentage && errors.percentage.message}</FormHelperText>
                        </FormControl>

                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel htmlFor="outlined-adornment-amount">Precio de venta</InputLabel>
                            <Controller
                                name="salePrice"
                                control={control}
                                defaultValue=""
                                render={({ field: { value, } }) => (
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Precio de componente"
                                        placeholder='0.00'
                                        size="small"
                                        value={value}
                                        type="number"
                                        disabled
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

export default ComponentUpdate