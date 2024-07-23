import Link from 'next/link';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import TableWrapper from '@/components/proposal-table/table-wrapper';
import { Button } from '@/components/ui/button';
import CardWrapper from '@/components/vault-details-card-wrapper';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import PlusCircle from 'lucide-react/dist/esm/icons/plus-circle';
import Coins from 'lucide-react/dist/esm/icons/coins';
import UserPlus from 'lucide-react/dist/esm/icons/user-plus';
import BarChart2 from 'lucide-react/dist/esm/icons/bar-chart-2';

const ActionButton = ({
    href,
    icon,
    text,
    disabled,
    toolTipText,
}: {
    href: string;
    icon: React.ReactNode;
    text: string;
    disabled: boolean;
    toolTipText: string;
}) => {
    const button = (
        <Button
            className="w-full h-full flex items-center justify-between"
            disabled={disabled}
        >
            <span className="flex items-center">
                {icon}
                {text}
            </span>
            <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    );

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            'block',
                            disabled && 'cursor-not-allowed'
                        )}
                    >
                        {disabled ? (
                            button
                        ) : (
                            <Link
                                href={href}
                                className={cn(
                                    'block',
                                    disabled && 'pointer-events-none opacity-50'
                                )}
                            >
                                {button}
                            </Link>
                        )}
                    </div>
                </TooltipTrigger>
                {disabled && (
                    <TooltipContent>
                        <p>{toolTipText}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
};

export default async function VaultDetailsPage({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const id = params.id;
    const vault = await prisma.fundingVault.findUnique({
        where: {
            id: Number(id),
        },
    });
    if (!vault) {
        redirect('/dashboard');
    }
    const isTallyDatePassed = vault.tallyDate.getTime() < Date.now();
    const isTallyed = vault.isTallied;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Vault Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardWrapper fundingVault={vault} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        All Proposals
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TableWrapper fundingVaultId={Number(id)} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ActionButton
                            href={`/create/proposal?vaultId=${id}`}
                            icon={<PlusCircle className="mr-2 h-4 w-4" />}
                            text="Create Proposal"
                            disabled={isTallyDatePassed}
                            toolTipText="Proposals can't be created after the tally date has passed."
                        />
                        <ActionButton
                            href={`/vault/deposit?vaultId=${id}`}
                            icon={<Coins className="mr-2 h-4 w-4" />}
                            text="Deposit Funding Tokens"
                            disabled={isTallyDatePassed}
                            toolTipText="Tokens can't be deposited after the tally date has passed."
                        />
                        <ActionButton
                            href={`/vault/register?vaultId=${id}`}
                            icon={<UserPlus className="mr-2 h-4 w-4" />}
                            text="Register to Vote"
                            disabled={isTallyDatePassed}
                            toolTipText="Registration is closed after the tally date has passed."
                        />
                        <ActionButton
                            href={`/vault/${id}/results`}
                            icon={<BarChart2 className="mr-2 h-4 w-4" />}
                            text="View Results"
                            disabled={!isTallyed}
                            toolTipText="Results will be available shortly after the tally date has passed."
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
