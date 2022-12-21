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
  FormLabel,
  Select,
  InputLabel,
  InputAdornment,
  OutlinedInput
} from '@mui/material';

// components
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

// date-fns
import { format, lastDayOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections - Se debe reempazar el nombre del componente por uno mas general
import { SuppliesListHead, SuppliesListToolbar } from '../areas';

const TABLE_HEAD = [
  { id: 'name', label: 'Nombre', alignRight: false },
  { id: 'role', label: 'Rol', alignRight: false },
  { id: 'email', label: 'Correo', alignRight: false },
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

const UsersPage = () => {

  /* User */

  const [id, setId] = useState(0);
  const [rolId, setRoleId] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [containerPassword, setContainerPassword] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showPassword, setshowPassword] = useState(true);

  /* Db */

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleCreateDialog = (event) => {
    setOpen(true);
    setId('');
    setRoleId(1);
    setName('');
    setEmail('');
    setPassword('abc123');
    setShowCreate(true);
    setContainerPassword(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmitDialog = async (event) => {
    event.preventDefault();
    if (id) {
      if(containerPassword){
        await axios.put(`/api/users/${id}/password`, {
          password,
        });
      }
      else{
        await axios.put(`/api/users/${id}`, {
          name,
          email,
          'role_id': rolId,
        });
      }
    } else {
      await axios.post('/api/users', {
        name,
        email,
        password,
        'role_id': rolId,
      });
    }
    handleCloseDialog();
    getUsers();
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

  const getUsers = async () => {
    const response = await axios.get('/api/users');
    setUsers(response.data);
  }

  const getRoles = async () => {
    const response = await axios.get('/api/roles');
    setRoles(response.data);
  }

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  return (
    <>
      <Helmet>
        <title> Gestión: Usuarios | Fab Lab System </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Usuarios del sistema
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
            Agregar usuario
          </Button>
        </Stack>

        <Card>
          <SuppliesListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar usuario..."} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <SuppliesListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={users.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {users.length > 0 ? (
                  <TableBody>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, name, role, email, active } = row;

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
                            {role.name}
                          </TableCell>

                          <TableCell align="left">
                            {email}
                          </TableCell>

                          <TableCell align="left">
                            <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                              async () => {
                                setUsers(users.map((user) => {
                                  if (user.id === id) {
                                    return { ...user, active: !active };
                                  }
                                  return user;
                                }));
                                await axios.put(`/api/users/${id}`, {
                                  active: !active
                                });
                              }
                            } />
                          </TableCell>

                          <TableCell align="right">
                            <IconButton size="large" color="inherit" onClick={() => {
                              setOpen(true);
                              setId(id);
                              setContainerPassword(true);
                              setShowCreate(false);
                              setPassword('');
                            }}>
                              <Iconify icon={'mdi:lock'} />
                            </IconButton>
                            <IconButton size="large" color="inherit" onClick={() => {
                              setOpen(true);
                              setId(id);
                              setName(name);
                              setEmail(email);
                              setRoleId(role.id);
                              setShowCreate(false);
                              setContainerPassword(false);
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
            count={users.length}
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
          Gestión de usuarios
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={
            {
              minWidth: 550,
            }
          }>
            {
              showCreate ?
                (
                  <>
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel id="document-type-select-label">Tipo de rol</InputLabel>
                      <Select
                        labelId="document-type-select-label"
                        id="document-type-select"
                        label="Tipo de rol"
                        value={rolId}
                        onChange={(event) => setRoleId(event.target.value)}
                        size="small"
                      >
                        {
                          roles.map((role) => {
                            return (
                              <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                            )
                          })
                        }
                      </Select>
                    </FormControl>

                    <FormControl sx={{ width: '100%' }}>
                      <TextField id="outlined-basic" label="Nombre" variant="outlined" value={name} size="small" onChange={(event) => {
                        setName(event.target.value)
                      }} />
                    </FormControl>

                    <FormControl sx={{ width: '100%' }}>
                      <TextField id="outlined-basic" label="Correo" variant="outlined" value={email} size="small" onChange={
                        (event) => {
                          setEmail(event.target.value)
                        }
                      } />
                    </FormControl>

                    <FormControl sx={{ width: '100%' }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value)
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setshowPassword(!showPassword)
                              }}
                              onMouseDown={(event) => {
                                event.preventDefault();
                              }}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Contraseña"
                        size='small'
                      />
                    </FormControl>
                  </>
                )
                :
                containerPassword ?
                  (
                    <FormControl sx={{ width: '100%' }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value)
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                setshowPassword(!showPassword)
                              }}
                              onMouseDown={(event) => {
                                event.preventDefault();
                              }}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Contraseña"
                      />
                    </FormControl>
                  )
                  :
                  (
                    <>
                      <FormControl sx={{ width: '100%' }}>
                        <InputLabel id="document-type-select-label">Tipo de rol</InputLabel>
                        <Select
                          labelId="document-type-select-label"
                          id="document-type-select"
                          label="Tipo de rol"
                          value={rolId}
                          onChange={(event) => setRoleId(event.target.value)}
                          size="small"
                        >
                          {
                            roles.map((role) => {
                              return (
                                <MenuItem key={role.id} value={role.id}>{role.name}</MenuItem>
                              )
                            })
                          }
                        </Select>
                      </FormControl>

                      <FormControl sx={{ width: '100%' }}>
                        <TextField id="outlined-basic" label="Nombre" variant="outlined" value={name} size="small" onChange={(event) => {
                          setName(event.target.value)
                        }} />
                      </FormControl>

                      <FormControl sx={{ width: '100%' }}>
                        <TextField id="outlined-basic" label="Correo" variant="outlined" value={email} size="small" onChange={
                          (event) => {
                            setEmail(event.target.value)
                          }
                        } />
                      </FormControl>
                    </>
                  )
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

export default UsersPage