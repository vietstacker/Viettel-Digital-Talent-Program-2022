import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const StudentList = Loadable(lazy(() => import('views/pages/StudentList')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <StudentList />
        },
        // {
        //     path: '/dashboard/default',
        //     element: <DashboardDefault />
        // },
        {
            path: '/ds-sinh-vien',
            element: <StudentList />
        }
    ]
};

export default MainRoutes;
