import TableWrapper from "@/components/proposals-table-wrapper";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CardWrapper from "@/components/vault-details-card-wrapper";
import Link from "next/link";

export default function VaultDetailsPage({
    params
}: {
    params: {
        id: string
    }
}) {
    const id = params.id;

    return (
        <div className="p-8 w-full h-full flex justify-center items-center flex-col gap-4">
            <div className="space-y-2 w-full">
                <h3 className="text-lg font-medium">
                    Vault Details
                </h3>
                <p className="text-sm text-muted-foreground">
                    View the details of the vault.
                </p>
            </div>
            <Separator className="bg-primary/10" />
            <CardWrapper
                fundingVaultId={Number(id)}
            />
            <div className="space-y-2 w-full">
                <h3 className="text-lg font-medium">
                    All Proposals
                </h3>
                <p className="text-sm text-muted-foreground">
                    All the proposals submitted to this vault.
                </p>
            </div>
            <Separator className="bg-primary/10" />
            <div className="w-full border-2 shadow-sm rounded-lg overflow-hidden min-h-96">
                <TableWrapper
                    fundingVaultId={Number(id)}
                />
            </div>
            <div className="space-y-2 w-full">
                <h3 className="text-lg font-medium">
                    Actions
                </h3>
            </div>
            <Separator className="bg-primary/10" />
            <div className="flex flex-row justify-around w-full">
                <Link href={`/proposal/new?vaultId=${id}`}>
                    <Button>
                        Create Proposal
                    </Button>
                </Link>
                <Link href={`/vault/deposit?vaultId=${id}`}>
                    <Button>
                        Deposit Funding Tokens
                    </Button>
                </Link>
                <Link href={`/vault/register?vaultId=${id}`}>
                    <Button>
                        Register to Vote
                    </Button>
                </Link>
            </div>
        </div>
    )
}