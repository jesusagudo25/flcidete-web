import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
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
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// date-fns
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// sections
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'purchase_price', label: 'Costo del material', alignRight: false },
  { id: 'sale_price', label: 'Precio de venta', alignRight: false },
  { id: 'purchase_weight', label: 'Peso de compra', alignRight: false },
  { id: 'current_weight', label: 'Peso actual', alignRight: false },
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

const FilamentsPage = () => {

    /* Toastify */

    const showToastMessage = () => {
      if (!id) toast.success('Filamento agregado con éxito!', {
        position: toast.POSITION.TOP_RIGHT
      });
      else toast.success('Filamento actualizado con éxito!', {
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

  const [id, setId] = useState('');

  const [name, setName] = useState('');

  const [estimatedValue, setEstimatedValue] = useState('');

  const [purchasePrice, setPurchasePrice] = useState('');

  const [salePrice, setSalePrice] = useState('');

  const [weight, setWeight] = useState('');

  const [percentage, setPercentage] = useState('');

  const [containerEstimatedValue, setContainerEstimatedValue] = useState(false);

  const [quantity, setQuantity] = useState(1);

  /* Datatable */

  const [filaments, setFilaments] = useState([]);

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
      setValue('salePrice',parseFloat(value).toFixed(2));
    }
    else {
      setValue('salePrice',parseFloat(0).toFixed(2));
    }
  };

  const handleCreateDialog = (event) => {
    setId('');
/*     setName('');
    setEstimatedValue('');
    setPurchasePrice('');
    setSalePrice('');
    setWeight('');
    setPercentage('');
    setQuantity(1);
     */
    setContainerEstimatedValue(false);
    reset();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    reset();
  };

  const handleSubmitDialog = async (event) => {
    if (id) {
      await axios.put(`/api/filaments/${id}`, {
        name: event.name,
        'purchase_price': event.purchasePrice,
        'estimated_value': containerEstimatedValue ? event.estimatedValue : event.purchasePrice,
        'percentage': event.percentage,
        'sale_price': event.salePrice,
        'purchased_weight': event.weight,
      });
    } else {
      await axios.post('/api/filaments', {
        'name': event.name.concat(' (', event.weight, ' g)'),
        'purchase_price': event.purchasePrice,
        'estimated_value': containerEstimatedValue ? event.estimatedValue : event.purchasePrice,
        'percentage': event.percentage,
        'sale_price': event.salePrice,
        'purchased_weight': event.weight,
        'current_weight': event.weight,
        'quantity': event.quantity,
      });
    }
    showToastMessage();
    handleCloseDialog();
    getFilaments();
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

  const getFilaments = async () => {
    const response = await axios.get('/api/filaments');
    setFilaments(response.data);
  }

  useEffect(() => {
    getFilaments();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filaments.length) : 0;

  const filteredFilaments = applySortFilter(filaments, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredFilaments.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Filamentos | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Filamentos
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
            Agregar Filamento
          </Button>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar filamento"} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={filaments.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {filaments.length > 0 ? (
                  <TableBody>
                    {filteredFilaments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, estimated_value: estimatedValue, purchase_price: purchasePrice, sale_price: salePrice, percentage, purchased_weight: purchasedWeight, current_weight: currentWeight, active } = row;

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
                            $ {purchasePrice}
                          </TableCell>

                          <TableCell align="left">
                            $ {salePrice}
                          </TableCell>

                          <TableCell align="left">
                           g {purchasedWeight}
                          </TableCell>

                          <TableCell align="left">
                           g {currentWeight}
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                if (active) (
                                  showToastMessageStatus('error', 'Filamento desactivado')
                                )
                                else (
                                  showToastMessageStatus('success', 'Filamento activado')
                                )
                                setFilaments(filaments.map((filament) => {
                                  if (filament.id === id) {
                                    return { ...filament, active: !active };
                                  }
                                  return filament;
                                }));
                                await axios.put(`/api/filaments/${id}`, {
                                  active: !active
                                });
                              }
                            } />
                          </TableCell>

                          <TableCell align="right">
                            <Link
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              to={`./update/${id}`}>
                              <IconButton size="large" color="inherit">
                                <Iconify icon={'mdi:archive-arrow-up-outline'} />
                              </IconButton>
                            </Link>
                            <IconButton size="large" color="inherit" onClick={() => {
                              setId(id);
/*                              setName(name);
                               setPurchasePrice(purchasePrice);
                              setSalePrice(salePrice);
                              setWeight(purchasedWeight);
                              setPercentage(percentage);
                              setEstimatedValue(estimatedValue); */
                              setValue('name', name);
                              setValue('purchasePrice', purchasePrice);
                              setValue('salePrice', salePrice);
                              setValue('weight', purchasedWeight);
                              setValue('percentage', percentage); 
                              setValue('estimatedValue', estimatedValue);
                              if (parseFloat(purchasePrice) === 0)
                                setContainerEstimatedValue(true)
                              else
                                setContainerEstimatedValue(false)
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
            count={filaments.length}
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
          Gestión de Filamentos
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
                    label="Descripción de filamento"
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

            <FormControl sx={{ width: '100%' }} error={!!errors?.purchasePrice}>
              <InputLabel htmlFor="outlined-adornment-amount">Costo del filamento</InputLabel>
              <Controller
                name="purchasePrice"
                control={control}
                defaultValue=""
                rules={{
                  required: 'El costo del filamento es requerido',
                  min: {
                    value: 0,
                    message: 'El costo del filamento debe ser mayor o igual a 0'
                  },
                  max: {
                    value: 100000,
                    message: 'El costo del filamento debe ser menor o igual a 100000'
                  }
                }}
                render={({ field: { onChange, onBlur, value, } }) => (
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Costo del filamento"
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
                        required: 'El costo estimado del filamento es requerido',
                        min: {
                          value: 1,
                          message: 'El costo estimado del filamento debe ser mayor o igual a 1'
                        },
                        max: {
                          value: 100000,
                          message: 'El costo estimado del filamento debe ser menor o igual a 100000'
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

            <FormControl sx={{ width: '100%' }}  error={!!errors?.weight}>
              <InputLabel htmlFor="weight-adornment-amount">Peso de filamento</InputLabel>
              <Controller
                name="weight"
                control={control}
                defaultValue=""
                rules={{
                  required: 'El peso del filamento es requerido',
                  min: {
                    value: 500,
                    message: 'El peso del filamento debe ser mayor o igual a 500'
                  },
                  max: {
                    value: 100000,
                    message: 'El peso del filamento debe ser menor o igual a 100000'
                  }
                }}
                render={({ field: { onChange, onBlur, value, } }) => (
              <OutlinedInput
                id="weight-adornment-amount"
                startAdornment={<InputAdornment position="start">g</InputAdornment>}
                label="Peso de filamento"
                placeholder='0'
                size="small"
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  handleCalculateSalePrice(getValues('purchasePrice'), getValues('estimatedValue'), getValues('percentage'))
                }}
                onBlur={onBlur}
                type="number"
                required
              />
                )}
              />
              <FormHelperText>{errors.weight && errors.weight.message}</FormHelperText>
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
                      handleCalculateSalePrice(getValues('purchasePrice'), getValues('estimatedValue'),e.target.value)
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
                    label="Precio de filamento"
                    placeholder='0.00'
                    size="small"
                    value={value}
                    type="number"
                    disabled
                  />
                )}
              />
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

export default FilamentsPage