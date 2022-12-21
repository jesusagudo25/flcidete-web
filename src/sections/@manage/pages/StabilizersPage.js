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
import { Link } from 'react-router-dom';
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
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'dimensions', label: 'Dimensiones', alignRight: false },
  { id: 'area', label: 'Area', alignRight: false },
  { id: 'purchase_price', label: 'Costo de material', alignRight: false },
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

const StabilizersPage = () => {


  /* Dialog */

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const [containerEstimatedValue, setContainerEstimatedValue] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [quantity, setQuantity] = useState(1);

  /* Datatable */

  const [stabilizers, setStabilizers] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCreateDialog = (event) => {
    setOpen(true);
    setId('');
    setName('');
    setPurchasePrice('');
    setEstimatedValue('');
    setContainerEstimatedValue(false);
    setWidth('');
    setHeight('');
    setQuantity(1);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmitDialog = async (event) => {
    event.preventDefault();
    if (id) {
      await axios.put(`/api/stabilizers/${id}`, {
        name,
        'purchase_price': purchasePrice,
        'estimated_value': containerEstimatedValue ? estimatedValue : purchasePrice,
        'width': width,
        'height_in_yd': height,
        'height': height * 36,
        'area': width * (height * 36),
      });
    } else {
      await axios.post('/api/stabilizers', {
        'name': name.concat(' (', width, ' in x', height, ' yd)'),
        'purchase_price': purchasePrice,
        'estimated_value': containerEstimatedValue ? estimatedValue : purchasePrice,
        'width': width,
        'height_in_yd': height,
        'height': height * 36,
        'area': width * (height * 36),
        'quantity': quantity,
      });
    }
    handleCloseDialog();
    getStabilizers();
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

  const getStabilizers = async () => {
    const response = await axios.get('/api/stabilizers');
    setStabilizers(response.data);
  }

  useEffect(() => {
    getStabilizers();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stabilizers.length) : 0;

  const filteredStabilizers = applySortFilter(stabilizers, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredStabilizers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Estabilizadores | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Estabilizadores
          </Typography>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
            Agregar estabilizador
          </Button>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar estabilizador..."} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={stabilizers.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {stabilizers.length > 0 ? (
                  <TableBody>
                    {filteredStabilizers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, purchase_price: purchasePrice, width, estimated_value: estimatedValue, height_in_yd: heightInYd, area, active } = row;

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
                            W: {width} in x L: {heightInYd} yd
                          </TableCell>

                          <TableCell align="left">
                            {area} in
                          </TableCell>

                          <TableCell align="left">
                            $ {purchasePrice}
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                setStabilizers(stabilizers.map((stabilizer) => {
                                  if (stabilizer.id === id) {
                                    return { ...stabilizer, active: !active };
                                  }
                                  return stabilizer;
                                }));
                                await axios.put(`/api/stabilizers/${id}`, {
                                  active: !active
                                });
                              }
                            } />
                          </TableCell>

                          <TableCell align="right">
                            <Link
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              to={`./${id}/update`}
                            >
                              <IconButton size="large" color="inherit">
                                <Iconify icon={'mdi:archive-arrow-up-outline'} />
                              </IconButton>
                            </Link>
                            <IconButton size="large" color="inherit" onClick={() => {
                              setId(id);
                              setName(name);
                              setWidth(width);
                              setHeight(heightInYd);
                              setPurchasePrice(purchasePrice);
                              if (parseFloat(purchasePrice) === 0) setContainerEstimatedValue(true);
                              setEstimatedValue(estimatedValue);
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
            count={stabilizers.length}
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
          Gestión de Estabilizadores
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ minWidth: 550 }}>
            <FormControl sx={{ width: '100%' }}>
              <TextField
                id="outlined-basic"
                label="Descripción del estabilizador"
                variant="outlined"
                size="small"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                required
              />
            </FormControl>

            <Stack direction="row" alignItems="center" spacing={1}>
              <FormControl sx={{ width: '50%' }}>
                <InputLabel htmlFor="outlined-adornment-amount">Ancho</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">in</InputAdornment>}
                  label="Ancho"
                  placeholder='0'
                  size="small"
                  type="number"
                  value={width}
                  onChange={(e) => {
                    setWidth(e.target.value)
                  }}
                />
              </FormControl>

              <FormControl sx={{ width: '50%' }}>
                <InputLabel htmlFor="outlined-adornment-amount">Largo</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">yd</InputAdornment>}
                  label="Largo"
                  placeholder='0'
                  size="small"
                  type="number"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value)
                  }}
                />
              </FormControl>
            </Stack>

            <FormControl sx={{ width: '100%' }}>
              <InputLabel htmlFor="outlined-adornment-amount">Costo de material</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="Costo de material"
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

export default StabilizersPage