import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
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
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { Controller, useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';

// components
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// date-fns
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'dimensions', label: 'Dimensiones', alignRight: false },
  { id: 'area', label: 'Área en stock', alignRight: false },
  { id: 'cost', label: 'Costo de material', alignRight: false },
  { id: 'sale_price', label: 'Precio de venta', alignRight: false },
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
    return filter(array, (_area) => _area.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
const MaterialsLaserPage = () => 
{

  const [isLoading, setIsLoading] = useState(false);
  /* Toastify */

  const showToastMessage = () => {
    if (!id) toast.success('Material agregado con éxito!', {
      position: toast.POSITION.TOP_RIGHT
    });
    else toast.success('Material actualizado con éxito!', {
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

  /* Dialog */

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [percentage, setPercentage] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [containerEstimatedValue, setContainerEstimatedValue] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  /* Datatable */

  const [materials, setMaterials] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [quantity, setQuantity] = useState(1);

  const handleCalculateSalePrice = (percentage, height, width, cost, estimatedValue) => {
    if (percentage > 0 && height > 0 && width > 0) {
      const valor = cost > 0 ? cost : estimatedValue;
      if (valor > 0) {
        const base = valor / (height * width);
        const sale = base + (base * (percentage / 100));
        /*         setPurchasePrice(base.toFixed(2));
                setSalePrice(sale.toFixed(2)); */;
        setValue('purchasePrice', base.toFixed(2));
        setValue('salePrice', sale.toFixed(2));
      }
      else {
        /*         setPurchasePrice('');
                setSalePrice(''); */
        setValue('purchasePrice', '');
        setValue('salePrice', '');
      }
    }
    else {
      /*       setPurchasePrice('');
            setSalePrice(''); */
      setValue('purchasePrice', '');
      setValue('salePrice', '');
    }
  };

  const handleCreateDialog = (event) => {
    reset();
    setOpen(true);
    setId('');
    setContainerEstimatedValue(false);
    /*     setName('');
        setPurchasePrice('');
        setEstimatedValue('');
        setWidth('');
        setHeight('');
        setCost('');
        setPercentage('');
        setSalePrice('');
        setQuantity(1); */
  };

  const handleCloseDialog = () => {
    reset();
    setOpen(false);
  };

  const handleSubmitDialog = async (event) => {
    handleCloseDialog();
    setIsLoading(true);
    if (id) {
      await axios.put(`/api/materials-laser/${id}`, {
        'name': event.name,
        'cost': event.cost,
        'purchase_price': event.purchasePrice,
        'estimated_value': containerEstimatedValue ? event.estimatedValue : event.cost,
        'percentage': event.percentage,
        'sale_price': event.salePrice,
        'width': event.width,
        'height': event.height,
        'area': event.width * event.height,
      });
      setIsLoading(false);
    } else {
      await axios.post('/api/materials-laser', {
        'name': event.name.concat(' (', event.width, ' ft x', event.height, ' ft)'),
        'cost': event.cost,
        'cost_base': event.cost,
        'purchase_price': event.purchasePrice,
        'estimated_value': containerEstimatedValue ? event.estimatedValue : event.cost,
        'percentage': event.percentage,
        'sale_price': event.salePrice,
        'width': event.width,
        'height': event.height,
        'area': event.width * event.height,
        'quantity': event.quantity,
      });
      setIsLoading(false);
    }
    showToastMessage();
    getMaterials();
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

  const getMaterials = async () => {
    setIsLoading(true);
    const response = await axios.get('/api/materials-laser');
    setMaterials(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    getMaterials();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - materials.length) : 0;

  const filteredMaterials = applySortFilter(materials, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredMaterials.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Materiales | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Materiales de corte láser
          </Typography>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
            Agregar material
          </Button>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar material..."} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={materials.length}
                  onRequestSort={handleRequestSort}
                />

                {materials.length > 0 ? (
                  <TableBody>
                    {filteredMaterials.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, cost, purchase_price: purchasePrice, sale_price: salePrice, estimated_value: estimatedValue, percentage, width, height, area, active } = row;

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
                            W: {width} ft x L: {height} ft
                          </TableCell>

                          <TableCell align="left">
                            {area} ft²
                          </TableCell>

                          <TableCell align="left">
                            $ {cost}
                          </TableCell>

                          <TableCell align="left">
                            $ {salePrice} ft²
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                try {
                                  setIsLoading(true);
                                  await axios.put(`/api/materials-laser/${id}`, {
                                    active: !active
                                  });
                                  setIsLoading(false);
                                  setMaterials(materials.map((material) => {
                                    if (material.id === id) {
                                      return { ...material, active: !active };
                                    }
                                    return material;
                                  }));
                                  if (active) (
                                    showToastMessageStatus('error', 'Material desactivado')
                                  )
                                  else (
                                    showToastMessageStatus('success', 'Material activado')
                                  )

                                } catch (error) {
                                  setIsLoading(false);
                                  showToastMessageStatus('error', 'Error al actualizar el estado')
                                }
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
                            <IconButton size="large" color="inherit" onClick={
                              () => {
                                setId(id);
                                
/*                                 setName(name);
                                setWidth(width);
                                setHeight(height);
                                setCost(cost);
                                setPurchasePrice(purchasePrice);
                                setEstimatedValue(estimatedValue);
                                setSalePrice(salePrice);
                                setPercentage(percentage);
 */
                                setValue('name', name);
                                setValue('width', width);
                                setValue('height', height);
                                setValue('cost', cost);
                                setValue('purchasePrice', purchasePrice);
                                setValue('estimatedValue', estimatedValue);
                                setValue('salePrice', salePrice);
                                setValue('percentage', percentage);

                                if (parseFloat(cost) === 0)
                                  setContainerEstimatedValue(true)
                                else
                                  setContainerEstimatedValue(false)
                                setOpen(true);
                              }
                            }>
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
            count={materials.length}
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
          Gestión de Materiales
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
                    label="Descripción del material"
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

            <Stack direction="row" alignItems="center" spacing={1}>
              <FormControl sx={{ width: '50%' }} error={!!errors?.width}>
                <InputLabel htmlFor="outlined-adornment-amount">Ancho</InputLabel>
                <Controller
                  name="width"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'El ancho es requerido',
                    min: {
                      value: 1,
                      message: 'El ancho debe ser mayor o igual a 1'
                    },
                    max: {
                      value: 100,
                      message: 'El ancho debe ser menor o igual a 100'
                    }
                  }}
                  render={({ field: { onChange, onBlur, value, } }) => (
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={<InputAdornment position="start">ft</InputAdornment>}
                      label="Ancho"
                      placeholder='0'
                      size="small"
                      type="number"
                      value={value}
                      onChange={
                        (e) => {
                          onChange(e.target.value);
                          handleCalculateSalePrice(getValues('percentage'), getValues('height'), e.target.value, getValues('cost'), getValues('estimatedValue'))
                        }
                      }
                      onBlur={onBlur}
                      required
                    />
                  )}
                />
                <FormHelperText>{errors.width && errors.width.message}</FormHelperText>
              </FormControl>

              <FormControl sx={{ width: '50%' }} error={!!errors?.height}>
                <InputLabel htmlFor="outlined-adornment-amount">Largo</InputLabel>
                <Controller
                  name="height"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'El largo es requerido',
                    min: {
                      value: 1,
                      message: 'El largo debe ser mayor o igual a 1'
                    },
                    max: {
                      value: 1000,
                      message: 'El largo debe ser menor o igual a 1000'
                    }
                  }}
                  render={({ field: { onChange, onBlur, value, } }) => (
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={<InputAdornment position="start">ft</InputAdornment>}
                      label="Largo"
                      placeholder='0'
                      size="small"
                      type="number"
                      value={value}
                      onChange={
                        (e) => {
                          onChange(e.target.value);
                          handleCalculateSalePrice(getValues('percentage'), e.target.value, getValues('width'), getValues('cost'), getValues('estimatedValue'))
                        }
                      }
                      onBlur={onBlur}
                      required
                    />
                  )}
                />
                <FormHelperText>{errors.height && errors.height.message}</FormHelperText>
              </FormControl>
            </Stack>

            <FormControl sx={{ width: '100%' }} error={!!errors?.cost}>
              <InputLabel htmlFor="outlined-adornment-amount">Costo de material</InputLabel>
              <Controller
                name="cost"
                control={control}
                defaultValue=""
                rules={{
                  required: 'El costo del material es requerido',
                  min: {
                    value: 0,
                    message: 'El costo del material debe ser mayor o igual a 0'
                  },
                  max: {
                    value: 100000,
                    message: 'El costo del material debe ser menor o igual a 100000'
                  }
                }}
                render={({ field: { onChange, onBlur, value, } }) => (
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Costo de material"
                    placeholder='0.00'
                    size="small"
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value)
                      if (parseFloat(e.target.value) === 0) {
                        setContainerEstimatedValue(true)
                        handleCalculateSalePrice(getValues('percentage'), getValues('height'), getValues('width'), e.target.value, getValues('estimatedValue'));
                      }
                      else {
                        setContainerEstimatedValue(false);
                        handleCalculateSalePrice(getValues('percentage'), getValues('height'), getValues('width'), e.target.value, getValues('estimatedValue'));
                      }
                    }}
                    onBlur={onBlur}
                    type="number"
                    required
                  />
                )}
              />
              <FormHelperText>{errors.cost && errors.cost.message}</FormHelperText>
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
                        required: 'El costo estimado del material es requerido',
                        min: {
                          value: 1,
                          message: 'El costo estimado del material debe ser mayor o igual a 1'
                        },
                        max: {
                          value: 100000,
                          message: 'El costo estimado del material debe ser menor o igual a 100000'
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
                            handleCalculateSalePrice(getValues('percentage'), getValues('height'), getValues('width'), getValues('cost'), e.target.value);
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
                      handleCalculateSalePrice(e.target.value, getValues('height'), getValues('width'), getValues('cost'), getValues('estimatedValue'));
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
              <InputLabel htmlFor="outlined-adornment-amount">Precio de venta ft²</InputLabel>
              <Controller
                name="salePrice"
                control={control}
                defaultValue=""
                render={({ field: { value, } }) => (
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Costo de material"
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

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default MaterialsLaserPage