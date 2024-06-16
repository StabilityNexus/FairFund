import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/lib/db";
import { Badge } from "./ui/badge";
import { type FundingVault } from "@prisma/client";
import Link from "next/link";
import { MoveUpRight } from 'lucide-react';


const tokenMap = (addr: string): string => {
    switch (addr) {
        case "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238":
            return "USDC"
        default:
            return "Unknown"
    }
}


export default async function TableWrapper() {

    const vaults: FundingVault[] = await prisma.fundingVault.findMany();

    return (
        <Table >
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Funding Token</TableHead>
                    <TableHead>Voting Token</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {vaults.map((vault) => (
                    <TableRow key={vault.id} >
                        <TableCell>{vault.id}</TableCell>
                        <TableCell>{vault.description}</TableCell>
                        <TableCell className="truncate">{vault.creatorAddress}</TableCell>
                        <TableCell><Badge variant="outline">{tokenMap(vault.fundingTokenAddress)}</Badge></TableCell>
                        <TableCell><Badge variant="outline">{tokenMap(vault.fundingTokenAddress)}</Badge></TableCell>
                        <TableCell>
                            <Badge variant="secondary">
                                <Link className="cursor-pointer p-1 flex gap-1" href={`/vault/${vault.id}`}>
                                    More
                                    <MoveUpRight className="h-4 w-4" />
                                </Link>
                            </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}