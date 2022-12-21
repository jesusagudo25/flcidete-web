import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Stack, Typography, Grid } from '@mui/material';
// mock
import PRODUCTS from '../_mock/products';
import {
  AppTrafficBySite,
} from '../sections/@dashboard/app';
import Iconify from '../components/iconify';
// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <>
      <Helmet>
        <title> Administración | Fab Lab System </title>
      </Helmet>

      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Panel de administración
        </Typography>

        <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'Clientes',
                  path: '/dashboard/management/customers',
                  icon: <Iconify icon={'mdi:account-group'} color="#2065D1" width={32} />,
                  role: [1,2,3]
                },
                {
                  name: 'Usuarios',
                  path: '/dashboard/management/users',
                  icon: <Iconify icon={'mdi:folder-account'} color="#2065D1" width={32} />,
                  role: [1]
                },
                {
                  name: 'Observaciones',
                  path: '/dashboard/management/observations',
                  icon: <Iconify icon={'mdi:file-document-edit'} color="#2065D1" width={32} />,
                  role: [1,2,3]
                },
                {
                  name: 'Eventos',
                  path: '/dashboard/management/events',
                  icon: <Iconify icon={'mdi:calendar-multiple'} color="#2065D1" width={32} />,
                  role: [1,3]
                },
                {
                  name: 'Ventas',
                  path: '/dashboard/management/invoices',
                  icon: <Iconify icon={'mdi:cash'} color="#2065D1" width={32} />,
                  role: [1,2,3]
                },
                {
                  name: 'Areas',
                  path: '/dashboard/management/areas',
                  icon: <Iconify icon={'mdi:desktop-classic'} color="#2065D1" width={32} />,
                  role: [1,2]
                },
                {
                  name: 'Visitas',
                  path: '/dashboard/management/visits',
                  icon: <Iconify icon={'mdi:ticket-account'} color="#2065D1" width={32} />,
                  role: [1,2,3]
                },

                {
                  name: 'Gastos técnicos',
                  path: '/dashboard/management/techexpenses',
                  icon: <Iconify icon={'mdi:currency-usd-off'} color="#2065D1" width={32} />,
                  role: [1,2,3]
                },
              ]}
            />
          </Grid>
      </Container>
    </>
  );
}
