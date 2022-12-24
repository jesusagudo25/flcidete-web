import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
  TextField,
  Button,
  DialogTitle,
  styled,
  Switch,
  FormControl,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';

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
  { id: 'price_purchase', label: 'Costo de material', alignRight: false },
  { id: 'purchased_amount', label: 'Cantidad comprada', alignRight: false },
  { id: 'status', label: 'Estado', alignRight: false },
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

const ThreadsPage = () => {

  /* Toastify */

  const showToastMessage = () => {
    if (!id) toast.success('Hilo agregado con éxito!', {
      position: toast.POSITION.TOP_RIGHT
    });
    else toast.success('Hilo actualizado con éxito!', {
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

  const { control, handleSubmit, reset, setValue, formState: { errors }, } = useForm({
    reValidateMode: 'onBlur'
  });

  /* Dialog */

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [pricePurchase, setPricePurchase] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [containerEstimatedValue, setContainerEstimatedValue] = useState(false);
  const [purchasedAmount, setPurchasedAmount] = useState('');
  const [quantity, setQuantity] = useState(1);

  /* Datatable */

  const [threads, setThreads] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCreateDialog = (event) => {
    setOpen(true);
    setId('');
    setContainerEstimatedValue(false);

    /*     setName('');
        setPricePurchase('');
        setEstimatedValue('');
        setPurchasedAmount('');
        setQuantity(1); */
    reset();
  };

  const handleCloseDialog = () => {
    reset();
    setOpen(false);
  };

  const handleSubmitDialog = async (event) => {
    handleCloseDialog();
    if (id) {
      await axios.put(`/api/threads/${id}`, {
        name: event.name,
        'price_purchase': event.pricePurchase,
        'estimated_value': containerEstimatedValue ? event.estimatedValue : event.pricePurchase,
        'purchased_amount': event.purchasedAmount
      });
    } else {
      await axios.post('/api/threads', {
        'name': event.name.concat(' (', event.purchasedAmount, ' yd)'),
        'price_purchase': event.pricePurchase,
        'price_purchase_base': event.pricePurchase,
        'estimated_value': containerEstimatedValue ? event.estimatedValue : event.pricePurchase,
        'estimated_value_base': containerEstimatedValue ? event.estimatedValue : event.pricePurchase,
        'purchased_amount': event.purchasedAmount,
        'purchased_amount_base': event.purchasedAmount,
        'quantity': event.quantity
      });
    }
    showToastMessage();
    reset();
    getThreads();
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

  const getThreads = async () => {
    const response = await axios.get('/api/threads');
    setThreads(response.data);
  }

  useEffect(() => {
    getThreads();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - threads.length) : 0;

  const filteredThreads = applySortFilter(threads, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredThreads.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Hilos | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Hilos
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <a
              href='./8/stabilizers'
              style={{ textDecoration: 'none' }}
            >
              <Button variant="contained" color='success' sx={
                {
                  color: 'white',
                }}>
                Gestionar estabilizadores
              </Button>
            </a>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
              Agregar Hilo
            </Button>
          </Stack>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar hilo..."} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={threads.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {threads.length > 0 ? (
                  <TableBody>
                    {filteredThreads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, price_purchase: pricePurchase, estimated_value: estimatedValue, purchased_amount: purchasedAmount, active } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">

                          <TableCell component="th" scope="row" padding="normal">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            $ {pricePurchase}
                          </TableCell>

                          <TableCell align="left">
                            {purchasedAmount} yd
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                if (active) (
                                  showToastMessageStatus('error', 'Hilo desactivado')
                                )
                                else (
                                  showToastMessageStatus('success', 'Hilo activado')
                                )
                                setThreads(threads.map((thread) => {
                                  if (thread.id === id) {
                                    return { ...thread, active: !active };
                                  }
                                  return thread;
                                }));
                                await axios.put(`/api/threads/${id}`, {
                                  active: !active
                                });
                              }
                            } />
                          </TableCell>

                          <TableCell align="right">
                            <Link
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              to={`./update/${id}`}
                            >
                              <IconButton size="large" color="inherit">
                                <Iconify icon={'mdi:archive-arrow-up-outline'} />
                              </IconButton>
                            </Link>
                            <IconButton size="large" color="inherit" onClick={() => {
                              setId(id);
                              if (parseFloat(pricePurchase) === 0) setContainerEstimatedValue(true);
                              setValue('name', name);
                              setValue('pricePurchase', pricePurchase);
                              setValue('purchasedAmount', purchasedAmount);
                              setValue('estimatedValue', estimatedValue);
                              /*                               setName(name);
                                                            setPricePurchase(pricePurchase); */
                              /*                               setPurchasedAmount(purchasedAmount);
                                                            setEstimatedValue(estimatedValue); */
                              setOpen(true);
                            }}>
                              <Iconify icon={'mdi:pencil-box'} />
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
            count={threads.length}
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
          Gestión de Hilos
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ minWidth: 550 }}>

            <FormControl sx={{ width: '100%' }}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: 'La descripción es requerida',
                  minLength: {
                    value: 3,
                    message: 'La descripción debe tener al menos 3 caracteres'
                  },
                  maxLength: {
                    value: 50,
                    message: 'La descripción debe tener máximo 50 caracteres'
                  }
                }}
                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                  <TextField
                    id="outlined-basic"
                    label="Descripción del hilo"
                    variant="outlined"
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

            <FormControl sx={{ width: '100%' }} error={!!errors?.pricePurchase}>
              <InputLabel htmlFor="outlined-adornment-amount">Costo de hilo</InputLabel>
              <Controller
                name="pricePurchase"
                control={control}
                defaultValue=""
                rules={{
                  required: 'El costo de hilo es requerido',
                  min: {
                    value: 0,
                    message: 'El costo de hilo debe ser mayor o igual a 0'
                  },
                  max: {
                    value: 50,
                    message: 'El costo de hilo debe ser menor o igual a 50'
                  }
                }}
                render={({ field: { onChange, onBlur, value, } }) => (
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Costo de hilo"
                    placeholder='0.00'
                    size="small"
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value)
                      if (parseFloat(e.target.value) === 0) {
                        setContainerEstimatedValue(true)
                      }
                      else {
                        setContainerEstimatedValue(false)
                      }
                    }}
                    onBlur={onBlur}
                    type="number"
                    required
                  />
                )}
              />
              <FormHelperText>{errors.pricePurchase && errors.pricePurchase.message}</FormHelperText>
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
                        required: 'El costo estimado de hilo es requerido',
                        min: {
                          value: 1,
                          message: 'El costo estimado de hilo debe ser mayor o igual a 1'
                        },
                        max: {
                          value: 50,
                          message: 'El costo estimado de hilo debe ser menor o igual a 50'
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

            <FormControl sx={{ width: '100%' }} error={!!errors?.purchasedAmount}>
              <InputLabel htmlFor="outlined-adornment-amount">Longitud de hilo</InputLabel>
              <Controller
                name="purchasedAmount"
                control={control}
                defaultValue=""
                rules={{
                  required: 'La longitud de hilo es requerida',
                  min: {
                    value: 1,
                    message: 'La longitud de hilo debe ser mayor o igual a 1'
                  },
                }}
                render={({ field: { onChange, onBlur, value, } }) => (
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">yd</InputAdornment>}
                    label="Longitud de hilo"
                    placeholder='0'
                    size="small"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    type="number"
                  />
                )}
              />
              <FormHelperText>{errors.purchasedAmount && errors.purchasedAmount.message}</FormHelperText>
            </FormControl>

            {
              !id ?
                (
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
                          value: 10000000,
                          message: 'La cantidad debe ser menor o igual a 10000'
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
                )
                : null
            }

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

export default ThreadsPage