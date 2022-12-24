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
  TextField,
  Button,
  DialogTitle,
  FormControlLabel,
  styled,
  Switch,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  OutlinedInput,
  Tab,
  Tabs,
  Grid
} from '@mui/material';

// components
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import { TimePicker } from '@mui/x-date-pickers';

// date-fns
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections - Se debe reempazar el nombre del componente por uno mas general
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'category', label: 'Categoría', alignRight: false },
  { id: 'date', label: 'Fecha', alignRight: false },
  { id: 'time', label: 'Horario', alignRight: false },
  { id: 'max_participants', label: 'Cupos', alignRight: false },
  { id: 'price', label: 'Precio', alignRight: false },
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
    return filter(array, (_event) => _event.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

/* ----------------- */

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const EventsPage = () => {
  
  /* Toastify */

  const showToastMessage = () => {
    if (!id) toast.success('Evento agregado con éxito!', {
      position: toast.POSITION.TOP_RIGHT
    });
    else toast.success('Evento actualizado con éxito!', {
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

  const { control, handleSubmit, reset } = useForm({
    reValidateMode: 'onBlur'
  });

  /* Event */

  const [id, setId] = useState(''); // Id del evento
  const [category, setCategory] = useState('1'); // Categoria del evento
  const [name, setName] = useState(''); // Nombre del evento
  const [initialDate, setInitialDate] = useState(null); // Fecha inicial del evento
  const [finalDate, setFinalDate] = useState(null); // Fecha final del evento
  const [initialTime, setInitialTime] = useState(null); // Hora inicial del evento
  const [finalTime, setFinalTime] = useState(null); // Hora final del evento
  const [maxParticipants, setMaxParticipants] = useState(0); // Maximo de participantes
  const [price, setPrice] = useState(0); // Precio del evento
  const [expenses, setExpenses] = useState(0); // Gastos del evento
  const [descriptionExpenses, setDescriptionExpenses] = useState(''); // Descripcion de los gastos
  const [checkAll, setCheckAll] = useState(false); // Checkbox de todos los areas

  /* Db */

  const [categories, setCategories] = useState([]); // Categorias de los eventos

  const [areas, setAreas] = useState([]); // Areas de los eventos - backend

  const [areasSelected, setAreasSelected] = useState([]); // Areas para desplegar en el modal

  const [events, setEvents] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('date');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectedAreas = (position) => {
    const updatedCheckedState = areasSelected.map((item, index) =>
      index === position ? {
        ...item,
        checked: !item.checked,
        id: item.checked ? '' : areas[position].id
      } : item
    );
    setAreasSelected(updatedCheckedState);

  }

  const handleChangeCheckAll = (event) => {
    setCheckAll(event.target.checked);
    if (event.target.checked) {
      setAreasSelected(areas.map((area) => {
        return {
          id: area.id,
          checked: true,
        }
      }));
    }
    else {
      setAreasSelected(areas.map((area) => {
        return {
          id: '',
          checked: false,
        }
      }));
    }
  };

  const handleCreateDialog = (event) => {
    setOpen(true);
    setId('');
    setCategory('1');
    setName('');
    setInitialDate(null);
    setFinalDate(null);
    setInitialTime(null);
    setFinalTime(null);
    setMaxParticipants(0);
    setPrice(0);
    setExpenses(0);
    setDescriptionExpenses('');
    setAreasSelected(new Array(areas.length).fill(
      {
        id: '',
        checked: false,
      }
    ));

  };

  const handleCloseDialog = () => {
    setOpen(false);
    setValue(0);
    setId('');
    setCategory('1');
    setName('');
    setInitialDate(new Date());
    setFinalDate(new Date());
    setInitialTime(new Date());
    setFinalTime(new Date());
    setMaxParticipants(0);
    setPrice(0);
    setExpenses(0);
    setDescriptionExpenses('');
    setAreasSelected(new Array(areas.length).fill(
      {
        id: '',
        checked: false,
      }
    ));
    setCheckAll(false);
  };

  const handleSubmitDialog = async (event) => {
    event.preventDefault();
    if (id) {
      await axios.put(`/api/events/${id}`, {
        event_category_id: category,
        name,
        initial_date: format(initialDate, 'yyyy-MM-dd'),
        final_date: format(finalDate, 'yyyy-MM-dd'),
        initial_time: format(initialTime, 'HH:mm:ss'),
        final_time: format(finalTime, 'HH:mm:ss'),
        max_participants: maxParticipants,
        price,
        expenses,
        description_expenses: descriptionExpenses,
        areas: areasSelected.filter((area) => area.id !== '').map((area) => {
          return {
            area_id: area.id,
          }
        })
      });
    } else {
      await axios.post('/api/events', {
        event_category_id: category,
        name,
        initial_date: format(initialDate, 'yyyy-MM-dd'),
        final_date: format(finalDate, 'yyyy-MM-dd'),
        initial_time: format(initialTime, 'HH:mm:ss'),
        final_time: format(finalTime, 'HH:mm:ss'),
        max_participants: maxParticipants,
        price,
        expenses,
        description_expenses: descriptionExpenses,
        areas: areasSelected.filter((area) => area.id !== '').map((area) => {
          return {
            area_id: area.id,
          }
        })
      });
    } 

    setValue(0);
    showToastMessage();
    handleCloseDialog();
    getEvents();
    setCheckAll(false);
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

  const getEvents = async () => {
    const response = await axios.get('/api/events');
    setEvents(response.data);
  }

  const getCategories = async () => {
    const response = await axios.get('/api/event-categories');
    setCategories(response.data);
  }

  const getAreas = async () => {
    const response = await axios.get('/api/areas');
    setAreas(response.data);
    setAreasSelected(
      new Array(response.data.length).fill(
        {
          id: '',
          checked: false,
        }
      )
    );
  }

  useEffect(() => {
    getEvents();
    getCategories();
    getAreas();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - events.length) : 0;

  const filteredEvents = applySortFilter(events, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredEvents.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Eventos | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Eventos
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <a
              href="./events/categories"
              style={{
                textDecoration: 'none',
              }}

            >
              <Button variant="contained" color='success' sx={{
                color: 'white',
              }}>
                Categorías
              </Button>
            </a>

            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
              Agregar evento
            </Button>
          </Stack>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar eventos..."} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={events.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {events.length > 0 ? (
                  <TableBody>
                    {filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, event_category: eventCategory, initial_date: initialDate, final_date: finalDate, initial_time: initialTime, final_time: finalTime, max_participants: maxParticipants, price, expenses, description_expenses: descriptionExpenses, areas: areasEvent, active } = row;

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
                            {eventCategory.name}
                          </TableCell>

                          <TableCell align="left">
                            {initialDate} &rarr; {finalDate}
                          </TableCell>

                          <TableCell align="left">
                            {initialTime.split(':')[0]} : {initialTime.split(':')[1]} &rarr; {finalTime.split(':')[0]} : {finalTime.split(':')[1]}
                          </TableCell>

                          <TableCell align="left">
                            {maxParticipants}
                          </TableCell>

                          <TableCell align="left">
                            $ {price}
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                if (active) (
                                  showToastMessageStatus('error', 'Evento desactivado')
                                )
                                else (
                                  showToastMessageStatus('success', 'Evento activado')
                                )
                                setEvents(events.map((event) => {
                                  if (event.id === id) {
                                    return { ...event, active: !active };
                                  }
                                  return event;
                                }));
                                await axios.put(`/api/events/${id}`, {
                                  active: !active
                                });
                              }
                            } />
                          </TableCell>

                          <TableCell align="right">
                            <a
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              href={`http://localhost:8000/api/events/${id}/participants/`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <IconButton size="large" color="inherit">
                                <Iconify icon={'mdi:account-group'} />
                              </IconButton>
                            </a>
                            <IconButton size="large" color="inherit" onClick={() => {
                              setId(id);
                              setName(name);
                              setCategory(eventCategory.id);
                              
                              setInitialDate(new Date(`${initialDate}T00:00:00`));
                              setFinalDate(new Date(`${finalDate}T00:00:00`));
                              setInitialTime(parseISO(`${initialDate}T${initialTime}`));
                              setFinalTime(parseISO(`${finalDate}T${finalTime}`));

                              setMaxParticipants(maxParticipants);
                              setPrice(price);
                              setExpenses(expenses);
                              setDescriptionExpenses(descriptionExpenses);

                              /* bookingSelected.areas */
                              const updatedCheckedState = [];

                              if (areasEvent.length < areas.length) {
                                areasSelected.forEach((area, index) => {
                                  const resul = areasEvent.find((item) => item.id === index + 1)
                                  if (resul) {
                                    updatedCheckedState.push({
                                      id: resul.id,
                                      checked: true,
                                    });
                                  } else {
                                    updatedCheckedState.push({
                                      id: '',
                                      checked: false,
                                    });
                                  }
                                });

                                setAreasSelected(updatedCheckedState);
                              } else {
                                setCheckAll(true);
                                setAreasSelected(
                                  areas.map((area) => {
                                    return {
                                      id: area.id,
                                      checked: true,
                                    }
                                  })
                                );
                              }
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
            count={events.length}
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
        maxWidth='md'
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
          Gestión de Eventos
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Información general" {...a11yProps(0)} />
              <Tab label="Áreas del evento" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Stack direction="row" sx={{
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: 550,
              gap: 3
            }}
            >
              <FormControl sx={{ width: '48%' }}>
                <TextField id="outlined-basic" label="Nombre del evento" variant="outlined" value={name} size="small" onChange={(event) => {
                  setName(event.target.value)
                }} />
              </FormControl>

              <FormControl sx={{ width: '48%' }}>
                <InputLabel id="document-type-select-label">Categoría de evento</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  label="Categoría de evento"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  size="small"
                >
                  {
                    categories.map((category) => {
                      return (
                        <MenuItem value={category.id}>{category.name}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>

              <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Fecha de inicio"
                  value={initialDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    setInitialDate(newValue);
                  }}
                  disablePast
                  renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                />
              </LocalizationProvider>

              <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Fecha de finalización"
                  value={finalDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    setFinalDate(newValue);
                  }}
                  disablePast
                  renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                />
              </LocalizationProvider>

              <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Hora de inicio"
                  value={initialTime}
                  onChange={(newValue) => {
                    setInitialTime(newValue)
                  }}
                  renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                  ampm
                  minTime={parseISO('2021-01-01T08:00:00')}
                  maxTime={parseISO('2021-01-01T16:00:00')}
                />
              </LocalizationProvider>

              <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                <TimePicker
                  label="Hora de finalización"
                  value={finalTime}
                  onChange={(newValue) => {
                    setFinalTime(newValue)
                  }}
                  renderInput={(params) => <TextField size='small' sx={{ width: '48%' }} {...params} />}
                  ampm
                  minTime={parseISO('2021-01-01T08:00:00')}
                  maxTime={parseISO('2021-01-01T16:00:00')}
                />
              </LocalizationProvider>

              <FormControl sx={{ width: '48%' }}>
                <TextField id="outlined-basic" label="Cantidad de participantes" variant="outlined" value={maxParticipants} size="small" onChange={(event) => {
                  setMaxParticipants(event.target.value)
                }}
                  type="number"
                  required />
              </FormControl>

              <FormControl sx={{ width: '48%' }}>
                <InputLabel htmlFor="outlined-adornment-amount">Precio de evento</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  label="Precio de evento"
                  placeholder='0.00'
                  size="small"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value)
                  }}
                  type="number"
                  required
                />
              </FormControl>

              <FormControl sx={{ width: '48%' }}>
                <InputLabel htmlFor="outlined-adornment-amount">Gastos</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  label="Gastos"
                  placeholder='0.00'
                  size="small"
                  value={expenses}
                  onChange={(e) => {
                    setExpenses(e.target.value)
                  }}
                  type="number"
                  required
                />
              </FormControl>

              <FormControl sx={{ width: '48%' }}>
                <TextField
                  id="outlined-textarea"
                  label="Descripción de los gastos"
                  multiline
                  size="small"
                  value={descriptionExpenses}
                  onChange={(e) => {
                    setDescriptionExpenses(e.target.value)
                  }}
                  required
                />
              </FormControl>
            </Stack>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {areas.map((area, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id={`area-checkbox-${index}`}
                        name={area.name}
                        value={area.id}
                        color="primary"
                        checked={areasSelected[index].checked}
                        onChange={() => handleSelectedAreas(index)}
                        disabled={checkAll}
                      />
                    }
                    label={area.name}
                  />
                </Grid>
              ))}
              <Grid item xs={2} sm={4} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`area-checkbox-$`}
                      name={'Marcar todas'}
                      checked={checkAll}
                      onChange={handleChangeCheckAll}
                    />
                  }
                  label={<Typography variant="subtitle1" color="textSecondary">- Marcar todas</Typography>}
                />
              </Grid>
            </Grid>
          </TabPanel>

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

export default EventsPage