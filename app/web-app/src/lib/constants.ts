import Vault from 'lucide-react/dist/esm/icons/vault';
import CirclePlus from 'lucide-react/dist/esm/icons/circle-plus';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import WalletCards from 'lucide-react/dist/esm/icons/wallet-cards';
import { Dice5Icon, DiscIcon } from 'lucide-react';

export const routes: Route[] = [
    {
        icon: LayoutDashboard,
        href: '/dashboard',
        label: 'Dashboard',
        options: [],
    },
    {
        icon: CirclePlus,
        label: 'Create',
        href: '/create',
        options: [
            {
                icon: Vault,
                label: 'Vault',
                href: '/create/vault',
            },
            {
                icon: WalletCards,
                label: 'Proposal',
                href: '/create/proposal',
            },
        ],
    },
    {
        icon: Dice5Icon,
        href: '/spaces',
        label: 'Spaces',
        options: [],
    },
];
