// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const students = {
    id: 'students',
    title: 'Quản lý sinh viên',
    type: 'group',
    children: [
        {
            id: 'ds-sinh-vien',
            title: 'DS Sinh viên',
            type: 'item',
            url: '/ds-sinh-vien',
            icon: icons.IconTypography,
            breadcrumbs: false
        }
    ]
};

export default students;
