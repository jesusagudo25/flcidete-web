import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import axios from 'axios'
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
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

} from '@mui/material';
// components
import {Link} from 'react-router-dom';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { VisitListHead, VisitListToolbar } from '../sections/@dashboard/visits';
// moc

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Lider', alignRight: false },
  { id: 'type', label: 'Tipo', alignRight: false },
  { id: 'reasonVisit', label: 'Razón', alignRight: false },
  { id: 'areas', label: 'Áreas', alignRight: false },
];

// ----------------------------------------------------------------------

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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export const CheckOut = () => {

  /* Datatable */

  const [visits, setVisits] = useState([]);

  const [categories, setCategories] = useState([]);

  const [open, setOpen] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const getVisits = async () => {
    const response = await axios.get('/api/visits/endtime-null');
    setVisits(response.data);
  }

  useEffect(() => {
    getVisits();
  }, []);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - visits.length) : 0;

  const filteredVisits = applySortFilter(visits, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredVisits.length && !!filterName;
  return (
      <>
        <Helmet>
          <title> Control de salida | Fab Lab System </title>
        </Helmet>

        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Control de salida
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>

            <a
                href='/dashboard/management/visits'
                style={{ textDecoration: 'none' }}
              >
                <Button color='success' variant="contained" sx={
                  {
                    color: 'white',
                  }}>
                  Gestionar visitas
                </Button>
              </a>
            </Stack>
          </Stack>
          
          
        <Card>
          <VisitListToolbar filterName={filterName} onFilterName={handleFilterByName} PlaceHolder={"Buscar componente..."} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <VisitListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={visits.length}
                  onRequestSort={handleRequestSort}
                />
                {/* Tiene que cargar primero... */}
                {visits.length > 0 ? (
                  <TableBody>
                    {filteredVisits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, customers, type, reason_visit: reasonVisit,  areas } = row;
                      console.log(customers);
                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox">

                          <TableCell component="th" scope="row" padding="normal">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {customers.length > 0 ? customers[0].name: 'Indefinido' }
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">
                            <Label color={type === 'I' ? 'success' : type === 'G' ? 'warning' : 'error'}>{sentenceCase(type)}</Label>
                              </TableCell>

                          <TableCell align="left">
                            {reasonVisit.name}
                          </TableCell>


                          <TableCell align="left">
                            <Link
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              to={`/dashboard/management/visits/${id}/areas`}
                            >
                              <IconButton size="large" color="secondary">
                                <Iconify icon={'mdi:desktop-classic'} />
                              </IconButton>
                            </Link>
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
            count={visits.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          
          </Card>
          </Container>
          </>
  );
};
          
              