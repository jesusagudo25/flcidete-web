// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Panel de inicio',
    path: '/dashboard/app',
    icon: icon('ic_dashboard'),
    role: [1,2,3]
  },
  {
    title: 'Recepción',
    path: '/dashboard/check-in',
    icon: icon('ic_checkin'),
    role: [1, 3]
  },
  {
    title: 'Control de salida',
    path: '/dashboard/check-out',
    icon: icon('ic_checkout'),
    role: [1, 3]
  },
  {
    title: 'Ventas',
    path: '/dashboard/new-sale',
    icon: icon('ic_cart'),
    role: [1, 2,3]
  },
  {
    title: 'Pagos',
    path: '/dashboard/payments',
    icon: icon('ic_payments'),
    role: [1,2,3]
  },
  {
    title: 'Reportes',
    path: '/dashboard/reports',
    icon: icon('ic_reports'),
    role: [1]
  },
  {
    title: 'Agenda',
    path: '/dashboard/schedule',
    icon: icon('ic_schedule'),
    role: [1,3]
  },
  {
    title: 'Administración',
    path: '/dashboard/management',
    icon: icon('ic_management'),
    role: [1,2,3]
  },
];

export default navConfig;
