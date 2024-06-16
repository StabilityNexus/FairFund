import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/lib/db";
import { Badge } from "./ui/badge";
import { type Proposal } from "@prisma/client";
import Link from "next/link";
import { MoveUpRight } from 'lucide-react';


interface ProposalDetailsTableWrapperProps {
    fundingVaultId: number;
}

export default async function ProposalDetailsTableWrapper({
    fundingVaultId
}: ProposalDetailsTableWrapperProps) {

    const proposals: Proposal[] = await prisma.proposal.findMany({
        where: {
            fundingVaultId
        }
    });

    return (
        <Table >
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Min Request Amount</TableHead>
                    <TableHead>Max Request Amount</TableHead>
                    <TableHead>Recipient</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {proposals.length > 0 ? (
                    proposals.map((proposal) => (
                        <TableRow key={proposal.id} >
                            <TableCell>{proposal.id}</TableCell>
                            <TableCell>{proposal.description}</TableCell>
                            <TableCell className="truncate">{proposal.minRequestAmount}</TableCell>
                            <TableCell><Badge variant="outline">{proposal.minRequestAmount}</Badge></TableCell>
                            <TableCell><Badge variant="outline">{proposal.recipient}</Badge></TableCell>
                            <TableCell>
                                <Badge variant="secondary">
                                    <Link className="cursor-pointer p-1 flex gap-1" href={`/proposal/${proposal.id}`}>
                                        More
                                        <MoveUpRight className="h-4 w-4" />
                                    </Link>
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">
                            No proposals yet.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}