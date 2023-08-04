import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter, set } from 'lodash';
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
  styled,
  Switch,
  Button,
  DialogTitle,
  FormControl,
  Backdrop,
  CircularProgress,
} from '@mui/material';

// components
import CloseIcon from '@mui/icons-material/Close';

// date-fns
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections - Se debe utilizar componentes propios (Por tiempo)
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
  { id: 'author', label: 'Autor', alignRight: false },
  { id: 'title', label: 'Titulo', alignRight: false },
  { id: 'date', label: 'Fecha', alignRight: false },
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
    return filter(array, (_observation) => _observation.user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const ObservationsPage = () => {

  const [isLoading, setIsLoading] = useState(false);

  /* Toastify */

  const showToastMessage = () => {
    if (!id) toast.success('Observación agregada con éxito!', {
      position: toast.POSITION.TOP_RIGHT
    });
    else toast.success('Observación actualizada con éxito!', {
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

  /* useForm */

  const { control, handleSubmit, reset, setValue } = useForm({
    reValidateMode: 'onBlur'
  });

  /* Obs */

  const [id, setId] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  /* Datable */

  const [observations, setObservations] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('date');

  const [filterAuthor, setFilterAuthor] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCreateDialog = (event) => {
    setId('');
    reset();
    /*     setTitle('');
        setDescription(''); */
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    reset();
  };

  const handleSubmitDialog = async (event) => {
    /* event.preventDefault(); */
    /* HandleSubmit de useForm */
    setIsLoading(true);
    if (id) {
      await axios.put(`/api/observations/${id}`, {
        title: event.title,
        description: event.description,
      });
      setIsLoading(false);
    } else {
      await axios.post('/api/observations', {
        title: event.title,
        description: event.description,
        'user_id': localStorage.getItem('id'),
      });
      setIsLoading(false);
    }
    showToastMessage();
    reset();
    handleCloseDialog();
    getObservations();
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

  const handleFilterByAuthor = (event) => {
    setPage(0);
    setFilterAuthor(event.target.value);
  };

  const getObservations = async () => {
    const response = await axios.get('/api/observations');
    setObservations(response.data);
    setIsLoading(false);
  }

  useEffect(() => {
    setIsLoading(true);
    getObservations();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - observations.length) : 0;

  const filteredObservations = applySortFilter(observations, getComparator(order, orderBy), filterAuthor);

  const isNotFound = !filteredObservations.length && !!filterAuthor;
  return (
    <>
      <Helmet>
        <title> Gestión: Observaciones | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Observaciones registradas
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
            Agregar observación
          </Button>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterAuthor} onFilterName={handleFilterByAuthor} PlaceHolder={"Buscar observación..."} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={observations.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {observations.length > 0 ? (
                  <TableBody>
                    {filteredObservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, user, title, description, created_at: createdAt, active } = row;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">

                          <TableCell component="th" scope="row" padding="normal">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {user.name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            {title}
                          </TableCell>

                          <TableCell align="left">
                            {createdAt.split('T')[0]}
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                setIsLoading(true);
                                if (active) (
                                  showToastMessageStatus('error', 'Observación desactivada')
                                )
                                else (
                                  showToastMessageStatus('success', 'Observación activada')
                                )
                                setObservations(observations.map((observation) => {
                                  if (observation.id === id) {
                                    return { ...observation, active: !active };
                                  }
                                  return observation;
                                }));
                                await axios.put(`/api/observations/${id}`, {
                                  active: !active
                                });
                                setIsLoading(false);
                              }
                            } />
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={() => {
                              setId(id);
                              /*                               setTitle(title);
                                                            setDescription(description); */
                              setValue('title', title);
                              setValue('description', description);
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
                            <strong>&quot;{filterAuthor}&quot;</strong>.
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
            count={observations.length}
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
          Gestión de observaciones
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ minWidth: 550 }}>

            <FormControl sx={{ width: '100%' }}>
              <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{
                  required: 'El título es requerido',
                  minLength: {
                    value: 3,
                    message: 'El título debe tener al menos 3 caracteres'
                  },
                  maxLength: {
                    value: 50,
                    message: 'El título debe tener máximo 50 caracteres'
                  }
                }}
                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                  <TextField
                    id="outlined-basic"
                    label="Título"
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
                  required: 'La descripción es requerida',
                  minLength: {
                    value: 3,
                    message: 'La descripción debe tener al menos 3 caracteres'
                  },
                  maxLength: {
                    value: 100,
                    message: 'La descripción debe tener máximo 100 caracteres'
                  }
                }}
                render={({ field: { onChange, onBlur, value, }, fieldState: { error } }) => (
                  <TextField
                    id="outlined-basic"
                    label="Descripción"
                    variant="outlined"
                    size="small"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    required
                    error={!!error}
                    helperText={error ? error.message : null}
                    required
                    multiline
                  />
                )}
              />

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

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default ObservationsPage