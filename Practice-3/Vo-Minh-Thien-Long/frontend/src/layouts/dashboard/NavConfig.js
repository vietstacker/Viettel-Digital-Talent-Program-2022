// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
      title: 'thực tập sinh',
      path: '/dashboard/intern',
      icon: getIcon('eva:people-fill'),
  },
    {
        title: 'bài giảng',
        path: '/dashboard/lecture',
        icon: getIcon('eva:book-open-fill'),
    }
];

export default navConfig;
