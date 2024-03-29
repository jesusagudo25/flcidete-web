import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import CheckIn from './pages/CheckIn';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ManagePage from './pages/ManagePage';
import DashboardAppPage from './pages/DashboardAppPage';
import NewSale from './pages/NewSale';
import ReportsPage from './pages/ReportsPage';
import Schedule from './pages/Schedule';
import ElectronicsPage from './sections/@manage/pages/ElectronicsPage';
import AreasPage from './sections/@manage/pages/AreasPage';
import MaterialsMillingPage from './sections/@manage/pages/MaterialsMillingPage';
import MaterialsLaserPage from './sections/@manage/pages/MaterialsLaserPage';
import VinylsPage from './sections/@manage/pages/VinylsPage';
import FilamentsPage from './sections/@manage/pages/FilamentsPage';
import ResinsPage from './sections/@manage/pages/ResinsPage';
import TechExpensesPage from './sections/@manage/pages/TechExpensesPage';
import VisitsPage from './sections/@manage/pages/VisitsPage';
import CustomersPage from './sections/@manage/pages/CustomersPage';
import ObservationsPage from './sections/@manage/pages/ObservationsPage';
import InvoicesPage from './sections/@manage/pages/InvoicesPage';
import ComponentsCategories from './sections/@manage/pages/ComponentsCategories';
import UsersPage from './sections/@manage/pages/UsersPage';
import EventsPage from './sections/@manage/pages/EventsPage';
import EventsCategories from './sections/@manage/pages/EventsCategories';
import VisitsCustomers from './sections/@manage/pages/VisitsCustomers';
import VisitsAreas from './sections/@manage/pages/VisitsAreas';
import VinylUpdate from './sections/@manage/pages/VinylUpdate';
import ComponentUpdate from './sections/@manage/pages/ComponentUpdate';
import FilamentUpdate from './sections/@manage/pages/FilamentUpdate';
import ResinUpdate from './sections/@manage/pages/ResinUpdate';
import MaterialLaserUpdate from './sections/@manage/pages/MaterialLaserUpdate';
import MillingUpdate from './sections/@manage/pages/MillingUpdate';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SettingsPage from './pages/SettingsPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { UserActivationPage } from './pages/UserActivationPage';
import { CheckOut } from './pages/CheckOut';
import PaymentPage from './pages/PaymentPage';
import MaterialsPrinterPage from './sections/@manage/pages/MaterialsPrinterPage';
import MaterialPrinterUpdate from './sections/@manage/pages/MaterialPrinterUpdate';
import SubsidiariesPage from './sections/@manage/pages/SubsidiariesPage';

import { PrivateRoute } from './components/auth/PrivateRoute';
import { PublicRoute } from './components/auth/PublicRoute';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'settings', element: <SettingsPage/> },
        { path: 'check-in', element: <CheckIn /> },
        { path: 'check-out', element: <CheckOut /> },
        { path: 'new-sale', element: <NewSale /> },
        { path: 'reports', element: <ReportsPage /> },
        { path: 'schedule', element: <Schedule /> },
        { path: 'payments', element: <PaymentPage /> },

        { path: 'management', element: <ManagePage /> },
        { path: 'management/visits', element: <VisitsPage /> },
        { path: 'management/visits/:id/customers', element: <VisitsCustomers /> },
        { path: 'management/visits/:id/areas', element: <VisitsAreas /> },
        { path: 'management/customers', element: <CustomersPage /> },
        { path: 'management/customers/:id/subsidiaries', element: <SubsidiariesPage /> },
        { path: 'management/users', element: <UsersPage /> },
        { path: 'management/observations', element: <ObservationsPage /> },
        
        { path: 'management/events', element: <EventsPage /> },
        { path: 'management/events/categories', element: <EventsCategories /> },

        { path: 'management/areas', element: <AreasPage /> },
        { path: 'management/areas/1', element: <ElectronicsPage /> },
        { path: 'management/areas/1/update/:id', element: <ComponentUpdate /> },
        { path: 'management/areas/1/categories', element: <ComponentsCategories /> },

        { path: 'management/areas/2', element: <MaterialsMillingPage /> },
        { path: 'management/areas/2/update/:id', element: <MillingUpdate /> },
        
        { path: 'management/areas/3', element: <MaterialsLaserPage /> },
        { path: 'management/areas/3/update/:id', element: <MaterialLaserUpdate /> },
        
        { path: 'management/areas/4', element: <VinylsPage /> },
        { path: 'management/areas/4/update/:id', element: <VinylUpdate /> },
        
        { path: 'management/areas/5', element: <FilamentsPage /> },
        { path: 'management/areas/5/update/:id', element: <FilamentUpdate /> },
        
        { path: 'management/areas/6', element: <ResinsPage /> },
        { path: 'management/areas/6/update/:id', element: <ResinUpdate /> },

        { path: 'management/areas/8', element: <MaterialsPrinterPage /> },
        { path: 'management/areas/8/update/:id', element: <MaterialPrinterUpdate />},
        
        { path: 'management/techexpenses', element: <TechExpensesPage /> },
        { path: 'management/invoices', element: <InvoicesPage /> },
      ],
    },
    {
      path: 'login',
      element: <PublicRoute><LoginPage /></PublicRoute>,
    },
    {
      path: 'register',
      element: <PublicRoute><RegisterPage /></PublicRoute>,
    },
    {
      path: 'forgot-password',
      element: <PublicRoute><ForgotPasswordPage /></PublicRoute>,
    },
    {
      path: 'reset-password/:token',
      element: <PublicRoute><ResetPasswordPage /></PublicRoute>,
    },
    {
      path: '/user-activation/:token',
      element: <PublicRoute><UserActivationPage /></PublicRoute>,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
