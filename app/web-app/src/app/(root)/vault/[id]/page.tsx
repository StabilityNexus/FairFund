import { Separator } from "@/components/ui/separator";
import CardWrapper from "@/components/vault-details-card-wrapper";

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
                id={Number(id)}
            />
            <div className="space-y-2 w-full">
                <h3 className="text-lg font-medium">
                    Token Details
                </h3>
                <p className="text-sm text-muted-foreground">
                    Funding and Voting token details.
                </p>
            </div>
            <Separator className="bg-primary/10" />
        </div>
    )
}