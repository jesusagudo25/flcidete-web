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
  TableHead,
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
  FormLabel,
  Select,
  InputLabel,
} from '@mui/material';

// components
import { Link } from 'react-router-dom';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';

// date-fns
import { format, lastDayOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';

// Sections - Se debe reempazar el nombre del componente por uno mas general
import { SuppliesListHead, SuppliesListToolbar } from '../sections/@manage/areas';

const TABLE_HEAD = [
  { id: 'id', label: 'Factura', alignRight: false },
  { id: 'name', label: 'Cliente', alignRight: false },
  { id: 'description', label: 'Descripción', alignRight: false },
  { id: 'total', label: 'Total', alignRight: false },
  { id: 'balance', label: 'Saldo', alignRight: false },
  { id: 'created_at', label: 'Fecha de compra', alignRight: false },
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
    return filter(array, (_area) => _area.id.toString(2).toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

function PaymentPage() {

  /* Invoices */

  const [id, setId] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [historyPayment, setHistoryPayment] = useState([]);

  /* Datatable */

  const [payments, setPayments] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmitDialog = async (event) => {
    event.preventDefault();
    if (historyPayment.length < 2 && isComplete === true) {
      await axios.post('/api/payments/', {
        invoice_id: id,
        payment_amount: historyPayment[0].payment_amount,
        balance: 0,
      });
    }
    handleCloseDialog();
    getPayments();
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

  const getPayments = async () => {
    const response = await axios.get('/api/invoices/payments');
    setPayments(response.data);
  }

  useEffect(() => {
    getPayments();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

  const filteredInvoices = applySortFilter(payments, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredInvoices.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Pagos | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Control de pagos
          </Typography>
        </Stack>


        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar factura..."} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={payments.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {payments.length > 0 ? (
                  <TableBody>
                    {filteredInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id:uuid, customer, total, description, created_at: createdAt, payments, status } = row;
                      return (
                        <TableRow hover key={uuid} tabIndex={-1} role="checkbox">

                          <TableCell component="th" scope="row" padding="normal">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                #{customer.uuid}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            {customer.name}
                          </TableCell>


                          <TableCell align="left">
                            {description}
                          </TableCell>

                          <TableCell align="left">
                            {total}
                          </TableCell>

                          <TableCell align="left">
                            {payments.length > 1 ? payments[1].balance : payments[0].balance}
                          </TableCell>

                          <TableCell align="left">
                            {createdAt.split('T')[0]}
                          </TableCell>

                          <TableCell align="left">
                            <Label color={status === 'F' ? 'success' : 'error'}>{sentenceCase(status === 'A' ? 'Por Cancelar' : 'Cancelado')}</Label>
                          </TableCell>

                          <TableCell align="right">
                            <a
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              href={`http://localhost:8000/api/invoices/${uuid}/pdf/`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <IconButton size="large" color="error">
                                <Iconify icon={'mdi:file-pdf'} />
                              </IconButton>
                            </a>
                            <IconButton size="large" color="inherit" onClick={() => {
                              setOpen(true);
                              setId(uuid);
                              setHistoryPayment(payments);
                              if (status === 'F') {
                                setIsComplete(true);
                              }
                            }}>
                              <Iconify icon={'mdi:pencil-box'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={8} />
                      </TableRow>
                    )}
                  </TableBody>
                )
                  :
                  (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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
            count={payments.length}
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
          Gestión de pagos
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ minWidth: 550 }}>

            <Typography variant="subtitle1">
              Historial de pagos
            </Typography>
            <TableContainer sx={{ minWidth: 550, }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell># Factura</TableCell>
                    <TableCell >Cantidad abonada </TableCell>
                    <TableCell >Balance</TableCell>
                    <TableCell >Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyPayment.map((row) => {
                    const { id, invoice_id: invoice, payment_amount: paymentAmount, balance, created_at: createdAtPayment } = row;
                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell component="th" scope="row" padding="normal">
                          {invoice}
                        </TableCell>
                        <TableCell align="left">
                          {paymentAmount}
                        </TableCell>
                        <TableCell align="left">
                          {balance}
                        </TableCell>
                        <TableCell align="left">
                          {createdAtPayment.split('T')[0]}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="subtitle1">
              Nuevo pago
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  id={`complete-check`}
                  name='complete-check'
                  value={isComplete}
                  color="primary"
                  checked={isComplete}
                  onChange={() => {
                    setIsComplete(!isComplete);
                  }}
                  disabled={historyPayment.length > 1}
                />
              }
              label='Completar'
            />
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

export default PaymentPage