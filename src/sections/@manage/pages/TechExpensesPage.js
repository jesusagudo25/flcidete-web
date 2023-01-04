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
  Select,
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

// Sections - Se debe reempazar el nombre del componente por uno mas general
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
  { id: 'name', label: 'Titulo', alignRight: false },
  { id: 'area', label: 'Área', alignRight: false },
  { id: 'amount', label: 'Cantidad', alignRight: false },
  { id: 'author', label: 'Autor', alignRight: false },
  { id: 'date', label: 'Fecha', alignRight: false },
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
    return filter(array, (_expense) => _expense.created_at.split('T')[0].toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const TechExpensesPage = () => {

  /* Toastify */

  const showToastMessage = () => {
    if (!id) toast.success('Gasto agregado con éxito!', {
      position: toast.POSITION.TOP_RIGHT
    });
    else toast.success('Gasto actualizado con éxito!', {
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

  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [amount, setAmount] = useState('');

  /* DB */

  const [techExpenses, setTechExpenses] = useState([]);
  const [areas, setAreas] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('date');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCreateDialog = (event) => {
    setOpen(true);
    setId('');
    reset();
    /* setName('');
    setDescription('');
    setArea('');
    setAmount(''); */
  };

  const handleCloseDialog = () => {
    setOpen(false);
    reset();
  };

  const handleSubmitDialog = async (event) => {
    handleCloseDialog();
    if (id) {
      await axios.put(`/api/tech-expenses/${id}`, {
        'name': event.name,
        'description': event.description,
        'area_id': event.area,
        'amount': event.amount,
      });
    } else {
      await axios.post('/api/tech-expenses', {
        'name': event.name,
        'description': event.description,
        'area_id': event.area,
        'amount': event.amount,
        'user_id': localStorage.getItem('id'),
      });
    }
    showToastMessage();
    reset();
    getTechExpenses();
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

  const getTechExpenses = async () => {
    const response = await axios.get('/api/tech-expenses');
    setTechExpenses(response.data);
  }

  const getAreas = async () => {
    const response = await axios.get('/api/areas');
    setAreas(response.data);
  }

  useEffect(() => {
    getTechExpenses();
    getAreas();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - techExpenses.length) : 0;

  const filteredVisit = applySortFilter(techExpenses, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredVisit.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Gástos técnicos | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Gástos técnicos registrados
          </Typography>

          <Button variant="contained" onClick={handleCreateDialog}>
            Registrar gasto técnico
          </Button>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar gásto..."} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={techExpenses.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {techExpenses.length > 0 ? (
                  <TableBody>
                    {filteredVisit.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, user, name, area, description, amount, created_at: createdAt, active } = row;

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
                            {area.name}
                          </TableCell>

                          <TableCell align="left">
                            $ {amount}
                          </TableCell>

                          <TableCell align="left">
                            {user.name}
                          </TableCell>

                          <TableCell align="left">
                            {createdAt.split('T')[0]}
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                if (active) (
                                  showToastMessageStatus('error', 'Gasto desactivado')
                                )
                                else (
                                  showToastMessageStatus('success', 'Gasto activado')
                                )
                                setTechExpenses(techExpenses.map((expense) => {
                                  if (expense.id === id) {
                                    return { ...expense, active: !active };
                                  }
                                  return expense;
                                }));
                                await axios.put(`/api/tech-expenses/${id}`, {
                                  active: !active
                                });
                              }
                            } />
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={() => {
                              setId(id);
                              /*                               setName(name);
                                                            setDescription(description);
                                                            setArea(area.id);
                                                            setAmount(amount); */
                              setValue('name', name);
                              setValue('description', description);
                              setValue('area', area.id);
                              setValue('amount', amount);
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
                        <TableCell colSpan={7} />
                      </TableRow>
                    )}
                  </TableBody>
                )
                  :
                  (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={7} sx={{ py: 3 }}>
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
            count={techExpenses.length}
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
          Gestión de Gastos técnicos
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={4} sx={{ minWidth: 550 }}>

            <FormControl sx={{ width: '100%' }}>
              <Controller
                name="name"
                control={control}
                defaultValue=""
                rules={{
                  required: 'El titulo del gasto es requerido',
                }}
                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                  <TextField
                    id="outlined-basic"
                    label="Titulo del gasto"
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

            <FormControl sx={{ width: '100%' }}>
              <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{
                  required: 'La descripción del gasto es requerida',
                }}
                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                  <TextField
                    id="outlined-basic"
                    label="Descripción del gasto"
                    variant="outlined"
                    size="small"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    required
                    multiline
                    error={!!error}
                    helperText={error ? error.message : null}
                  />
                )}
              />
            </FormControl>

            <FormControl size="small" error={!!errors?.area}>
              <InputLabel id="category-select-label">Área del gasto</InputLabel>
              <Controller
                name="area"
                control={control}
                defaultValue=""
                rules={{
                  required: 'El área es requerida',
                }}
                render={({ field: { onChange, onBlur, value, } }) => (
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={value}
                    label="Selecciona el área"
                    onChange={onChange}
                    onBlur={onBlur}
                    required
                  >
                    {
                      areas.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                      ))
                    }
                  </Select>
                )}
              />
              <FormHelperText>{errors?.area?.message}</FormHelperText>
            </FormControl>

            <FormControl sx={{ width: '100%' }} error={!!errors?.amount}>
              <InputLabel htmlFor="outlined-adornment-amount">Costo</InputLabel>
              <Controller
                name="amount"
                control={control}
                defaultValue=""
                rules={{
                  required: 'El costo es requerido',
                  min: {
                    value: 0,
                    message: 'El costo debe ser mayor o igual a 0'
                  },
                  max: {
                    value: 999999999,
                    message: 'El costo debe ser menor o igual a 999999999'
                  }
                }}
                render={({ field: { onChange, onBlur, value, } }) => (
                  <OutlinedInput
                    id="outlined-adornment-amount"
                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                    label="Costo"
                    placeholder='0'
                    size="small"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    type="number"
                    required
                  />
                )}
              />
              <FormHelperText>{errors?.amount?.message}</FormHelperText>
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

export default TechExpensesPage