import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import axios from 'axios';
// @mui
import { ToastContainer, toast } from 'react-toastify';
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
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

// components
import { useParams } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

// date-fns
import { format, lastDayOfMonth, set } from 'date-fns';
import { es } from 'date-fns/locale';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections - Se debe reempazar el nombre del componente por uno mas general
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
  { id: 'document_number', label: 'Documento', alignRight: false },
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'email', label: 'Correo', alignRight: false },
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
    return filter(array, (_area) => _area.document_number.split('T')[0].toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const VisitsCustomers = () => {
  const { id } = useParams()

  const [isLoading, setIsLoading] = useState(false);


  const [customers, setCustomers] = useState([]); // Lista de visitntes

  const [customerList, setCustomerList] = useState([]); // Lista de clientes autocompletar

  /* Customer */

  const [customerId, setCustomerId] = useState('');

  const [customerName, setCustomerName] = useState('');

  const [document, setDocument] = React.useState('');

  const [documentType, setDocumentType] = React.useState('C');

  /* DT */

  const getDataAutoComplete = (searchTerm) => {

    if (previousController.current) {
      previousController.current.abort();
    }
    const controller = new AbortController();
    const signal = controller.signal;
    previousController.current = controller;

    axios.get(`/api/customers/${documentType}/${searchTerm}`, { signal })
      .then((res) => {
        const data = res.data.map((item) => {
          return {
            label: item.document_number,
            value: item.id,
            name: item.name,
          };
        });
        setCustomerList(data);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const previousController = useRef();

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('date');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);


  const handleCreateDialog = (event) => {
    setCustomerList([]);
    setCustomerId('');
    setCustomerName('');
    setDocument('');
    setDocumentType('C');
    setOpen(true);
  };

  const handleSubmitDialog = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    
    if (!customerId) {
      toast.error('Debe seleccionar un cliente');
      setIsLoading(false);
      handleCloseDialog();
      return;
    }

    await axios.post('/api/visits/customers', {
      visit_id: id,
      customer_id: customerId
    });
    setIsLoading(false);
    toast.success('Visitante adicionado con éxito');
    handleCloseDialog();
    getCustomers();
  };

  const handleCloseDialog = () => {
    setOpen(false);
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

  const getCustomers = async () => {
    const response = await axios.get(`/api/visits/${id}`);
    setCustomers(response.data.customers);
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    getCustomers();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customers.length) : 0;

  const filteredCustomers = applySortFilter(customers, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredCustomers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Visitantes | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Visitantes
          </Typography>

          <Button variant="contained" onClick={handleCreateDialog}>
            Agregar visitante
          </Button>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar visitante..."} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={customers.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {customers.length > 0 ? (
                  <TableBody>
                    {filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id: customerId, document_number: documentNumber, name, email } = row;
                      return (
                        <TableRow hover key={customerId} tabIndex={-1} role="checkbox">

                          <TableCell component="th" scope="row" padding="normal">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {documentNumber}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            {name}
                          </TableCell>

                          <TableCell align="left">
                            {email || 'No registrado'}
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="error" onClick={
                              async () => {
                                setIsLoading(true);
                                setCustomers(customers.filter((customer) => customer.id !== customerId));
                                try {
                                  const response = await axios.put(`/api/visits/${id}/customers`, {
                                    customer_id: customerId
                                  });
                                  setIsLoading(false);
                                  toast.success('Visitante eliminado con éxito');
                                } catch (error) {
                                  console.log(error.response);
                                  setIsLoading(false);
                                }
                                getCustomers();
                              }
                            }>
                              <Iconify icon={'eva:trash-2-outline'} />
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
            count={customers.length}
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
          Gestión de visitantes
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ minWidth: 550 }}>
            <FormControl>
              <InputLabel id="document-type-select-label"
                sx={{ width: 400 }}
              >Tipo de documento</InputLabel>
              <Select
                labelId="document-type-select-label"
                id="document-type-select"
                label="Tipo de documento"
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
                size="small"
              >
                <MenuItem value={'C'}>Cédula</MenuItem>
                <MenuItem value={'P'}>Pasaporte</MenuItem>
              </Select>
            </FormControl>

            <Autocomplete
              value={document}
              disablePortal={false}
              id="visitors-autocomplete"
              options={customerList}
              onChange={(event, newValue) => {
                setDocument(newValue.label);
                setCustomerName(newValue.name);
                setCustomerId(newValue.value);
                setCustomerList([]);
              }}
              onInputChange={
                (event, newInputValue) => {
                  setDocument(newInputValue);
                  if (event) {
                    if (event.target.value.length > 0) {
                      getDataAutoComplete(event.target.value);
                    }
                    else {
                      setCustomerList([]);
                    }
                  }
                }
              }
              sx={{ width: '100%' }}
              size="small"
              noOptionsText="No hay resultados"
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              clearOnEscape
              blurOnSelect
              renderInput={(params) => <TextField {...params} label="Número de documento" />}
            />

            <FormControl>
              <TextField
                id="name-visitors"
                label="Nombre del visitante"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                size="small"
                disabled
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

      {/* Toastify */}

      <ToastContainer />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default VisitsCustomers