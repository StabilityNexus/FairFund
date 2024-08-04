import Vault from 'lucide-react/dist/esm/icons/vault';
import CirclePlus from 'lucide-react/dist/esm/icons/circle-plus';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import WalletCards from 'lucide-react/dist/esm/icons/wallet-cards';
import LayersIcon from 'lucide-react/dist/esm/icons/layers';
import ActivityIcon from 'lucide-react/dist/esm/icons/activity';

export const routes: Route[] = [
    {
        icon: LayoutDashboard,
        href: '/dashboard',
        label: 'Dashboard',
        options: [],
        protected: false,
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
        protected: true,
    },
    {
        icon: LayersIcon,
        href: '/spaces',
        label: 'Spaces',
        options: [],
        protected: false,
    },
    {
        icon: ActivityIcon,
        href: '/profile',
        label: 'My Activity',
        options: [],
        protected: true,
    },
];
