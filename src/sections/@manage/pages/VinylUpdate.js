import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
import { useNavigate, useParams } from 'react-router-dom';
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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// date-fns
import { format, lastDayOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
  { id: 'cost', label: 'Costo de material', alignRight: false },
  { id: 'percentage', label: 'Porcentaje ganancia', alignRight: false },
  { id: 'sale_price', label: 'Precio de venta', alignRight: false },
  { id: 'created_at', label: 'Fecha', alignRight: false },
  { id: 'status', label: 'Estado', alignRight: false },
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

const VinylUpdate = () => {

  /* Dialog */

  const { id } = useParams();
  const [vinylName, setVinylName] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [cost, setCost] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [percentage, setPercentage] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [containerEstimatedValue, setContainerEstimatedValue] = useState(false);

  /* Datatable */

  const [vinylsUpdate, setVinylsUpdate] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('created_at');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCalculateSalePrice = (percentage, height, width, cost, estimatedValue) => {
    if (percentage > 0) {
      const valor = cost > 0 ? cost : estimatedValue;
      if (valor > 0) {
        console.log(valor);
        const base = valor / (height * width);
        const sale = base + (base * (percentage / 100));
        setPurchasePrice(base.toFixed(3));
        setSalePrice(sale.toFixed(3));
      }
      else {
        setPurchasePrice('');
        setSalePrice('');
      }
    }
    else {
      setPurchasePrice('');
      setSalePrice('');
    }
  };

  const handleCreateDialog = (event) => {
    setOpen(true);
    setPurchasePrice('');
    setEstimatedValue('');
    setContainerEstimatedValue(false);
    setCost('');
    setPercentage('');
    setSalePrice('');
    setQuantity(1);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmitDialog = async (event) => {
    event.preventDefault();
    await axios.post('/api/vinyls-updates', {
      'vinyl_id': id,
      cost,
      'purchase_price': purchasePrice,
      'estimated_value': containerEstimatedValue ? estimatedValue : cost,
      percentage,
      'sale_price': salePrice,
      'quantity': quantity,
    });
    handleCloseDialog();
    getVinylsUpdate();
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

  const getVinylsUpdate = async () => {
    const response = await axios.get(`/api/vinyls/${id}`);
    setVinylsUpdate(response.data.vinyl_updates);
    setVinylName(response.data.name);
    setWidth(response.data.width);
    setHeight(response.data.height);
  }

  useEffect(() => {
    getVinylsUpdate();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - vinylsUpdate.length) : 0;

  const filteredVinylsUpdate = applySortFilter(vinylsUpdate, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredVinylsUpdate.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Vinilos | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Actualizaciones de {vinylName}
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
                  rowCount={vinylsUpdate.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {vinylsUpdate.length > 0 ? (
                  <TableBody>
                    {filteredVinylsUpdate.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id: uuid, cost, purchase_price: purchasePrice, estimated_value: estimatedValue, percentage, sale_price: salePrice, created_at: createdAt, active } = row;

                      return (
                        <TableRow hover key={uuid} tabIndex={-1} role="checkbox">

                          <TableCell component="th" scope="row" padding="normal">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              $ {cost}
                            </Stack>
                          </TableCell>


                          <TableCell align="left">
                            % {percentage}
                          </TableCell>

                          <TableCell align="left">
                            $ {salePrice} in²
                          </TableCell>

                          <TableCell align="left">
                            <Typography variant="subtitle2" noWrap>
                              {createdAt.split('T')[0]}
                            </Typography>
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                setVinylsUpdate(vinylsUpdate.map((vinyl) => {
                                  if (vinyl.id === uuid) {
                                    return { ...vinyl, active: !active };
                                  }
                                  return vinyl;
                                }));
                                await axios.put(`/api/vinyls-updates/${uuid}`, {
                                  'vinyl_id': id,
                                  active: !active
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
            count={vinylsUpdate.length}
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
          Gestión de Vinilos
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={4} sx={{ minWidth: 550 }}>

            <FormControl sx={{ width: '100%' }}>
              <InputLabel htmlFor="outlined-adornment-amount">Costo de material</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Costo de material"
                placeholder='0.00'
                size="small"
                value={cost}
                onChange={(e) => {
                  setCost(e.target.value)
                  if (parseFloat(e.target.value) === 0) {
                    setContainerEstimatedValue(true)
                    handleCalculateSalePrice(percentage, height, width, e.target.value, estimatedValue);
                  }
                  else {
                    setContainerEstimatedValue(false);
                    handleCalculateSalePrice(percentage, height, width, e.target.value, estimatedValue);
                  }
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
                        handleCalculateSalePrice(percentage, height, width, cost, e.target.value);
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
              <InputLabel htmlFor="outlined-adornment-amount">Porcentaje de ganancia</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">%</InputAdornment>}
                label="Porcentaje de ganancia"
                placeholder='0'
                size="small"
                value={percentage}
                onChange={(e) => {
                  setPercentage(e.target.value);
                  handleCalculateSalePrice(e.target.value, height, width, cost, estimatedValue);
                }}
                type="number"
                required
              />
            </FormControl>


            <FormControl sx={{ width: '100%' }}>
              <InputLabel htmlFor="outlined-adornment-amount">Precio de venta in²</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Costo de material"
                placeholder='0.000'
                size="small"
                value={salePrice}
                type="number"
                disabled
              />
            </FormControl>

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

export default VinylUpdate