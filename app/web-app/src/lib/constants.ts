import { CirclePlus, LayoutDashboard } from 'lucide-react';

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
