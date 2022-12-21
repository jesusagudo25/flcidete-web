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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

// date-fns
import { format, lastDayOfMonth } from 'date-fns';
import Label from '../../../components/label';
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
    return filter(array, (_area) => _area.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const Softwares = () => {

  /* Create - edit */

  const [id, setId] = useState('');

  const [name, setName] = useState('');

  const [estimatedValue, setEstimatedValue] = useState('');

  const [purchasePrice, setPurchasePrice] = useState('');

  const [salePrice, setSalePrice] = useState('');

  const [purchaseDate, setPurchaseDate] = useState(new Date());

  const [expirationDate, setExpirationDate] = useState(new Date());

  const [percentage, setPercentage] = useState('');

  const [containerEstimatedValue, setContainerEstimatedValue] = useState(false);

  /* Datatable */

  const [softwares, setSoftwares] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCreateDialog = (event) => {
    setId('');
    setName('');
    setEstimatedValue('');
    setPurchasePrice('');
    setPurchaseDate(new Date());
    setExpirationDate(new Date());
    setSalePrice('');
    setContainerEstimatedValue(false);

    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  /* Bug - date picker */
  const handleSubmitDialog = async (event) => {
    event.preventDefault();
    if (id) {
      console.log(purchaseDate, expirationDate);
       await axios.put(`/api/softwares/${id}`, {
        name,
        'purchase_price': purchasePrice,
        'estimated_value': containerEstimatedValue ? estimatedValue : purchasePrice,
        'sale_price': salePrice,
        'purchased_date': format(new Date(purchaseDate), 'yyyy-MM-dd'),
        'expiration_date': format(new Date(expirationDate), 'yyyy-MM-dd')
      }); 

    } else {
      await axios.post('/api/softwares', {
        name,
        'purchase_price': purchasePrice,
        'estimated_value': containerEstimatedValue ? estimatedValue : purchasePrice,
        'sale_price': salePrice,
        'purchased_date': format(new Date(purchaseDate), 'yyyy-MM-dd'),
        'expiration_date': format(new Date(expirationDate), 'yyyy-MM-dd')
      });
    }
    handleCloseDialog();
    getSoftwares();
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

  const getSoftwares = async () => {
    const response = await axios.get('/api/softwares');
    setSoftwares(response.data);
  }

  useEffect(() => {
    getSoftwares();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - softwares.length) : 0;

  const filteredSoftwares = applySortFilter(softwares, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredSoftwares.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Softwares | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Softwares
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
            Agregar software
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
                  rowCount={softwares.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {softwares.length > 0 ? (
                  <TableBody>
                    {filteredSoftwares.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, purchase_price: purchasePrice, sale_price: salePrice, expiration_date: expirationDate, active } = row;

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
                            {expirationDate}
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                setSoftwares(softwares.map((software) => {
                                  if (software.id === id) {
                                    return { ...software, active: !active };
                                  }
                                  return software;
                                }));
                                await axios.put(`/api/softwares/${id}`, {
                                  active: !active
                                });
                              }
                            } />
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={() => {
                              setId(id);
                              setName(name);
                              setPurchasePrice(purchasePrice);
                              setSalePrice(salePrice);
                              setPurchaseDate(purchaseDate);
                              setExpirationDate(expirationDate);
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
            count={softwares.length}
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
          Gestión de Softwares
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={4} sx={{ minWidth: 550 }}>

            <FormControl sx={{ width: '100%' }}>
              <TextField
                id="outlined-basic"
                label="Descripción del software"
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
              <InputLabel htmlFor="outlined-adornment-amount">Costo del software</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Costo del software"
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
                        setEstimatedValue(e.target.value)
                      }}
                      type="number"
                      required
                    />
                  </FormControl>
                )
                :
                null
            }

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha de compra"
                value={purchaseDate}
                onChange={(newValue) => {
                  setPurchaseDate(newValue);
                }}
                renderInput={(params) => <TextField size='small' {...params} />}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Fecha de expiración"
                value={expirationDate}
                onChange={(newValue) => {
                  setExpirationDate(newValue);
                }}
                renderInput={(params) => <TextField size='small' {...params} />}
              />
            </LocalizationProvider>

            <FormControl sx={{ width: '100%' }}>
              <InputLabel htmlFor="outlined-adornment-amount">Precio por hora</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Precio por hora"
                size="small"
                placeholder='0.00'
                value={salePrice}
                onChange={(e) => {
                  setSalePrice(e.target.value)
                }}
                type="number"
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

export default Softwares