import CirclePlus from 'lucide-react/dist/esm/icons/circle-plus';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';

export const routes: Route[] = [
    {
        icon: LayoutDashboard,
        href: '/dashboard',
        label: 'Dashboard',
    },
    {
        icon: CirclePlus,
        href: '/vault/new',
        label: 'Create',
    },
];
