import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';  
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, 
  Backdrop,
  CircularProgress } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  const [ageRangeByF, setAgeRangeByF] = useState([]);
  const [ageRangeByM, setAgeRangeByM] = useState([]);
  const [areasPopularity, setAreasPopularity] = useState([]);
  const [districtsPopularity, setDistrictsPopularity] = useState([]);
  const [expensesByMonth, setExpensesByMonth] = useState(null);
  const [invoicesByMonth, setInvoicesByMonth] = useState(null);
  const [newCustomersByMonth, setNewCustomersByMonth] = useState(null);
  const [paymentsByMonth, setPaymentsByMonth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [data1, setData1] = useState([]); // <-- this is the state
  const [data2, setData2] = useState([]); // <-- this is the state
  const [labelLine, setLabelLine] = useState([]); // <-- this is the state
  
  const incomeV = [];
  const expensesV = [];
  const labelV = [];
  const areasV = [];
  const districtsV = [];
  const ageRangeByFV = [];
  const ageRangeByMV = [];

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/graphs').then((response) => {
      setIsLoading(false);
      /* Estatico */
      setExpensesByMonth(response.data.expenses);
      setInvoicesByMonth(response.data.invoicesMonth);
      setNewCustomersByMonth(response.data.newCustomers);
      setPaymentsByMonth(response.data.payments);
      
      /* Dinamico */
      
      incomeV.push(response.data.incomeExpenses.data.map((item) => item.income));
      expensesV.push(response.data.incomeExpenses.data.map((item) => item.expenses));
      labelV.push(response.data.incomeExpenses.labels);
      areasV.push(response.data.areasPercentage.map((item) => {
        return {
          label: item.name,
          value: item.percentage,
        }
      }));
      districtsV.push(response.data.districtsTop.map((item) => {
        return {
          label: item.district_id,
          value: item.total,
        }
      }
      ));
      ageRangeByFV.push(response.data.ageRangeByF.map((item) => item.total));
      ageRangeByMV.push(response.data.ageRangeByM.map((item) => item.total));

    });
    setData1(incomeV);
    setData2(expensesV);
    setLabelLine(labelV);
    setAreasPopularity(areasV);
    setDistrictsPopularity(districtsV);
    setAgeRangeByF(ageRangeByFV);
    setAgeRangeByM(ageRangeByMV);
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard | Fab Lab System </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
        Hola, bienvenido de vuelta
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Ventas mensuales" total={invoicesByMonth} icon={'mdi:cash'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Nuevos clientes" total={newCustomersByMonth} color="info" icon={'mdi:account-arrow-right'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Pagos en curso" total={paymentsByMonth} color="warning" icon={'mdi:checkbox-marked-circle-plus-outline'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Gastos técnicos" total={expensesByMonth} color="error" icon={'mdi:currency-usd-off'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Ingresos y gastos por mes"
              chartLabels={labelLine[0]}
              chartData={[
                {
                  name: 'Ingresos',
                  type: 'area',
                  fill: 'gradient',
                  data: data1[0]
                },
                {
                  name: 'Gastos',
                  type: 'line',
                  fill: 'solid',
                  data: data2[0]
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Áreas más visitadas"
              chartData={areasPopularity[0]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Distritos frecuentes"
              chartData={districtsPopularity[0]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Frecuencia de visitantes por género y edad"
              chartLabels={['18 o menos', '19 - 26', '27 - 35', '36 - más']}
              chartData={[
                { name: 'Masculinos', data: ageRangeByM[0] },
                { name: 'Femeninos', data: ageRangeByF[0] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>
        </Grid>
      </Container>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    </>
  );
}
