import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// @mui
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
    Select,
    FormLabel,
} from '@mui/material';

// components
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Slide from '@mui/material/Slide';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';

// date-fns
import { format, lastDayOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';

// Sections
import { CustomerListHead, CustomerListToolbar } from '../customers';
import config from '../../../config.json';

const TABLE_HEAD = [
    { id: 'name', label: 'Nombre', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'telephone', label: 'Teléfono', alignRight: false },
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
        return filter(array, (_subsidiary) => _subsidiary.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}
const SubsidiariesPage = () => {

    const { id } = useParams();

    /* Subsidiaries */

    const [subsidiaryId, setSubsidiaryId] = useState(''); // Id
    const [name, setName] = useState(''); // Nombre
    const [email, setEmail] = useState(''); // Correo
    const [telephone, setTelephone] = useState(''); // Teléfono

    const [provinceSelected, setProvinceSelected] = useState(9); // Provincia
    const [districtSelected, setDistrictSelected] = useState(60); // Distrito
    const [townshipSelected, setTownshipSelected] = useState(492); // Municipio

    /* Databases */

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [townships, setTownships] = useState([]);

    const [subsidiaries, setSubsidiaries] = useState([]);

    const [open, setOpen] = useState(false);

    const [page, setPage] = useState(0);

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('document');

    const [filterDocument, setFilterDocument] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleCreateDialog = (event) => {
        setOpen(true);
        setSubsidiaryId('');
        setName('');
        setEmail('');
        setTelephone('');
        setProvinceSelected(9);
        setDistrictSelected(60);
        setTownshipSelected(492);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        axios.get(`${config.GEOPTYAPI_URL}/api/province/9/districts`)
            .then((response) => {
                setDistricts(response.data);
                setDistrictSelected(response.data[0].id);
                axios.get(`${config.GEOPTYAPI_URL}/api/district/60/townships`)
                    .then((response) => {
                        setTownships(response.data);
                        setTownshipSelected(response.data[0].id);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleSubmitDialog = async (event) => {
        event.preventDefault();

         if (subsidiaryId) {
            await axios.put(`/api/subsidiaries/${subsidiaryId}`, {
                name,
                email,
                telephone,
                province_id: provinceSelected,
                district_id: districtSelected,
                township_id: townshipSelected,
            });
        } else {
            await axios.post('/api/subsidiaries', {
                'customer_id': id,
                name,
                email,
                telephone,
                province_id: provinceSelected,
                district_id: districtSelected,
                township_id: townshipSelected,
            });
        }
        handleCloseDialog();
        getSubsidiaries();
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

    const handleFilterByDocument = (event) => {
        setPage(0);
        setFilterDocument(event.target.value);
    };

    const getSubsidiaries = async () => {
        const response = await axios.get(`/api/customers/${id}/subsidiaries`);
        setSubsidiaries(response.data);
    };

    const getProvinces = () => {
        axios.get(`${config.GEOPTYAPI_URL}/api/provinces/active`)
            .then((response) => {
                setProvinces(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getDistricts = (id) => {
        axios.get(`${config.GEOPTYAPI_URL}/api/province/${id}/districts/active`)
            .then((response) => {
                setDistricts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getTownships = (id) => {
        axios.get(`${config.GEOPTYAPI_URL}/api/district/${id}/townships/active`)
            .then((response) => {
                setTownships(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getSubsidiaries();
        getProvinces();
        getDistricts(provinceSelected);
        getTownships(districtSelected);
    }, []);

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subsidiaries.length) : 0;

    const filteredSubsidiaries = applySortFilter(subsidiaries, getComparator(order, orderBy), filterDocument);

    const isNotFound = !filteredSubsidiaries.length && !!filterDocument;

    return (
        <>
            <Helmet>
                <title> Gestión: Divisiones | Fab Lab System </title>
            </Helmet>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Divisiones registradas
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleCreateDialog}>
                        Agregar division
                    </Button>
                </Stack>

                <Card>
                    <CustomerListToolbar filterDocument={filterDocument} onFilterDocument={handleFilterByDocument} />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <CustomerListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={subsidiaries.length}
                                    onRequestSort={handleRequestSort}
                                />
                                {/* Tiene que cargar primero... */}
                                {subsidiaries.length > 0 ? (
                                    <TableBody>
                                        {filteredSubsidiaries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id: uuid, name, email, telephone, active, province_id: provinceId, district_id: districtId, township_id: townshipId } = row;
                                            return (
                                                <TableRow hover key={uuid} tabIndex={-1} role="checkbox">

                                                    <TableCell component="th" scope="row" padding="normal">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>



                                                    <TableCell align="left">
                                                        {email}
                                                    </TableCell>


                                                    <TableCell align="left">
                                                        {telephone}
                                                    </TableCell>


                                                    <TableCell align="left">
                                                        <ButtonSwitch checked={active} inputProps={{ 'aria-label': 'ant design' }} onClick={
                                                            async () => {
                                                                setSubsidiaries(subsidiaries.map((subsidiary) => {
                                                                    if (subsidiary.id === uuid) {
                                                                        return { ...subsidiary, active: !active };
                                                                    }
                                                                    return subsidiary;
                                                                }));
                                                                await axios.put(`/api/subsidiaries/${uuid}`, {
                                                                    active: !active
                                                                });
                                                            }
                                                        } />
                                                    </TableCell>

                                                    <TableCell align="right">
                                                        <IconButton size="large" color="inherit" onClick={() => {
                                                            setSubsidiaryId(uuid);

                                                            setName(name);
                                                            setEmail(email);

                                                            setProvinceSelected(provinceId);
                                                            setDistrictSelected(districtId);
                                                            setTownshipSelected(townshipId);
                                                            axios.get(`${config.GEOPTYAPI_URL}/api/province/${provinceId}/districts/active`)
                                                                .then((response) => {
                                                                    setDistricts(response.data);
                                                                    setDistrictSelected(districtId);
                                                                    axios.get(`${config.GEOPTYAPI_URL}/api/district/${districtId}/townships/active`)
                                                                        .then((response) => {
                                                                            setTownships(response.data);
                                                                            setTownshipSelected(townshipId);
                                                                        })
                                                                        .catch((error) => {
                                                                            console.log(error);
                                                                        });
                                                                })
                                                                .catch((error) => {
                                                                    console.log(error);
                                                                });
                                                            setOpen(true)
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
                                                        <strong>&quot;{filterDocument}&quot;</strong>.
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
                        count={subsidiaries.length}
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
                maxWidth='md'
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseDialog}>
                    Gestión de divisiones
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Stack direction="row" sx={{
                        marginTop: '5px', flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        minWidth: 550,
                        gap: 2,
                    }}>

                        <FormControl sx={{ width: '48%' }}>
                            <TextField id="outlined-basic" label="Nombre" variant="outlined" value={name} size="small" onChange={(event) => {
                                setName(event.target.value)
                            }} />
                        </FormControl>

                        <FormControl sx={{ width: '48%' }}>
                            <TextField id="outlined-basic" label="Correo" variant="outlined" value={email} size="small" onChange={
                                (event) => {
                                    setEmail(event.target.value)
                                }
                            } />
                        </FormControl>

                        <FormControl sx={{ width: '48%' }}>
                            <TextField id="outlined-basic" label="Teléfono" variant="outlined" value={telephone} size="small" onChange={
                                (event) => {
                                    setTelephone(event.target.value)
                                }
                            } />
                        </FormControl>

                        <FormControl sx={{ width: '48%' }}>
                            <InputLabel id="select-label-province">Provincia</InputLabel>
                            <Select
                                labelId="select-label-province"
                                id="select-province"
                                label="Provincia"
                                value={provinceSelected}
                                onChange={(e) => {
                                    setProvinceSelected(e.target.value);
                                    axios.get(`${config.GEOPTYAPI_URL}/api/province/${e.target.value}/districts/active`)
                                        .then((response) => {
                                            setDistricts(response.data);
                                            setDistrictSelected(response.data[0].id);
                                            axios.get(`${config.GEOPTYAPI_URL}/api/district/${response.data[0].id}/townships/active`)
                                                .then((response) => {
                                                    setTownships(response.data);
                                                    setTownshipSelected(response.data[0].id);
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                });
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }}
                                size="small"
                            >
                                {provinces.map((province) => (
                                    <MenuItem key={province.id} value={province.id}>{province.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '48%' }}>
                            <InputLabel id="select-label-district">Distrito</InputLabel>
                            <Select
                                labelId="select-label-district"
                                id="select-district"
                                label="Distrito"
                                value={districtSelected}
                                onChange={(e) => {
                                    setDistrictSelected(e.target.value);
                                    axios.get(`${config.GEOPTYAPI_URL}/api/district/${e.target.value}/townships/active`)
                                        .then((response) => {
                                            setTownships(response.data);
                                            setTownshipSelected(response.data[0].id);
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                }}
                                size="small"
                            >
                                {districts.map((district) => (
                                    <MenuItem key={district.id} value={district.id}>{district.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '48%' }}>
                            <InputLabel id="select-label-township">Corregimiento</InputLabel>
                            <Select
                                labelId="select-label-township"
                                id="select-township"
                                label="Corregimiento"
                                value={townshipSelected}
                                onChange={(e) => {
                                    setTownshipSelected(e.target.value);
                                }}
                                size="small"
                            >
                                {townships.map((township) => (
                                    <MenuItem key={township.id} value={township.id}>{township.name}</MenuItem>
                                ))}
                            </Select>
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

export default SubsidiariesPage