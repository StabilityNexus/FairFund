import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Vote from 'lucide-react/dist/esm/icons/vote';

const CardWrapperSkeleton = () => (
    <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
    </div>
);

const VoteProposalSkeleton = () => (
    <div className="m-6 pt-4 w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
);

const ProposalDetailsPage = () => {
    return (
        <div className="container mx-auto py-8 space-y-8 text-gray-900 dark:text-gray-100">
            <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center">
                        <FileText className="mr-2" />
                        Proposal Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        View the details of the proposal.
                    </p>
                    <CardWrapperSkeleton />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center">
                        <Vote className="mr-2" />
                        Vote on Proposal
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Enter the amount of tokens you want to allocate to this
                        proposal.
                    </p>
                    <div className="mt-4 flex justify-center">
                        <VoteProposalSkeleton />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProposalDetailsPage;
