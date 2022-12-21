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
    role: [3]
  },
  {
    title: 'Control de salida',
    path: '/dashboard/check-out',
    icon: icon('ic_checkout'),
    role: [3]
  },
  {
    title: 'Ventas',
    path: '/dashboard/new-sale',
    icon: icon('ic_cart'),
    role: [2,3]
  },
  {
    title: 'Control de atención',
    path: '/dashboard/attend',
    icon: icon('ic_attention'),
    role: [2]
  },
  {
    title: 'Reportes',
    path: '/dashboard/reports',
    icon: icon('ic_reports'),
    role: [1]
  },
  {
    title: 'Tareas',
    path: '/dashboard/tasks',
    icon: icon('ic_tasks'),
    role: []
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
