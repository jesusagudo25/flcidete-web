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
  InputLabel,
} from '@mui/material';

// components
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// date-fns
import { format, lastDayOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import Label from '../../../components/label';
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

const ResinsPage = () => {


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

  const [resins, setResins] = useState([]);

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
      setSalePrice(parseFloat(value).toFixed(2));
    }
    else {
      setSalePrice(parseFloat(0).toFixed(2))
    }
  };

  const handleCreateDialog = (event) => {
    setId('');
    setName('');
    setEstimatedValue('');
    setPurchasePrice('');
    setSalePrice('');
    setWeight('');
    setPercentage('');
    setContainerEstimatedValue(false);
    setQuantity(1);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmitDialog = async (event) => {
    event.preventDefault();
    if (id) {
      await axios.put(`/api/resins/${id}`, {
        name,
        'purchase_price': purchasePrice,
        'estimated_value': containerEstimatedValue ? estimatedValue : purchasePrice,
        'percentage': percentage,
        'sale_price': salePrice,
        'purchased_weight': weight,
      });
    } else {
      await axios.post('/api/resins', {
        'name': name.concat(' (', weight, ' g)'),
        'purchase_price': purchasePrice,
        'estimated_value': containerEstimatedValue ? estimatedValue : purchasePrice,
        'percentage': percentage,
        'sale_price': salePrice,
        'purchased_weight': weight,
        'current_weight': weight,
        'quantity': quantity,
      });
    }
    handleCloseDialog();
    getResins();
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

  const getResins = async () => {
    const response = await axios.get('/api/resins');
    setResins(response.data);
  }

  useEffect(() => {
    getResins();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - resins.length) : 0;

  const filteredResins = applySortFilter(resins, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredResins.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Resinas | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Resinas
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
            Agregar Resina
          </Button>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar resina"} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={resins.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {resins.length > 0 ? (
                  <TableBody>
                    {filteredResins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
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
                            {purchasePrice}
                          </TableCell>

                          <TableCell align="left">
                            {salePrice}
                          </TableCell>

                          <TableCell align="left">
                            {purchasedWeight}
                          </TableCell>

                          <TableCell align="left">
                            {currentWeight}
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                setResins(resins.map((resin) => {
                                  if (resin.id === id) {
                                    return { ...resin, active: !active };
                                  }
                                  return resin;
                                }));
                                await axios.put(`/api/resins/${id}`, {
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
                              setName(name);
                              setPurchasePrice(purchasePrice);
                              if (parseFloat(purchasePrice) === 0)
                                setContainerEstimatedValue(true)
                              else
                                setContainerEstimatedValue(false)
                              setSalePrice(salePrice);
                              setWeight(purchasedWeight);
                              setPercentage(percentage);
                              setEstimatedValue(estimatedValue);
                              setContainerEstimatedValue(false);
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
            count={resins.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      {/* Dialog */}

      <BootstrapDialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth='sm'
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
          Gestión de Resinas
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ minWidth: 550 }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField
                id="outlined-basic"
                label="Descripción de la resina"
                variant="outlined"
                size="small"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                required
              />
            </FormControl>

            <FormControl sx={{ width: '100%' }}>
              <InputLabel htmlFor="outlined-adornment-amount">Costo de resina</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Costo de resina"
                placeholder='0.00'
                size="small"
                value={purchasePrice}
                onChange={(e) => {
                  setPurchasePrice(e.target.value)
                  if (parseFloat(e.target.value) === 0) {
                    setContainerEstimatedValue(true)
                  }
                  else {
                    setContainerEstimatedValue(false)
                  }
                  handleCalculateSalePrice(e.target.value, estimatedValue, percentage)
                }}
                type="number"
                required
              />
            </FormControl>

            {
              containerEstimatedValue ?
                (
                  <FormControl sx={{ width: '100%' }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Costo estimado</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                      label="Costo estimado"
                      placeholder='0.00'
                      size="small"
                      value={estimatedValue}
                      onChange={(e) => {
                        setEstimatedValue(e.target.value);
                        handleCalculateSalePrice(purchasePrice, e.target.value, percentage)
                      }}
                      type="number"
                      required
                    />
                  </FormControl>
                )
                :
                null
            }

            <FormControl sx={{ width: '100%' }}>
              <InputLabel htmlFor="weight-adornment-amount">Peso de resina</InputLabel>
              <OutlinedInput
                id="weight-adornment-amount"
                startAdornment={<InputAdornment position="start">g</InputAdornment>}
                label="Peso de resina"
                placeholder='0'
                size="small"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  handleCalculateSalePrice(purchasePrice, estimatedValue, percentage)
                }}
                type="number"
                required
              />
            </FormControl>


            <FormControl sx={{ width: '100%' }}>
              <InputLabel htmlFor="percentage-adornment-amount">Porcentaje de ganancia</InputLabel>
              <OutlinedInput
                id="percentage-adornment-amount"
                startAdornment={<InputAdornment position="start">%</InputAdornment>}
                label="Porcentaje de ganancia"
                placeholder='0'
                size="small"
                value={percentage}
                onChange={(e) => {
                  setPercentage(e.target.value);
                  handleCalculateSalePrice(purchasePrice, estimatedValue, e.target.value)
                }}
                type="number"
                required
              />
            </FormControl>


            <FormControl sx={{ width: '100%' }}>
              <InputLabel htmlFor="price-adornment-amount">Precio de venta</InputLabel>
              <OutlinedInput
                id="price-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Costo de material"
                placeholder='0.00'
                size="small"
                value={salePrice}
                type="number"
                disabled
              />
            </FormControl>

            {
              !id ?
                (
                  <FormControl sx={{ width: '100%' }}>
                    <TextField
                      id="outlined-number"
                      label="Cantidad"
                      type="number"
                      size="small"
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(e.target.value)
                      }}
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
          <Button size="large" autoFocus onClick={handleSubmitDialog}>
            Guardar
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  )
}

export default ResinsPage