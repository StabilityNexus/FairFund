import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const CardWrapperSkeleton = () => (
    <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
    </div>
);

const TableWrapperSkeleton = () => (
    <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
    </div>
);

const ActionButtonSkeleton = () => (
    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
);

const VaultDetailsPageSkeleton = () => {
    return (
        <div className="container mx-auto p-6 space-y-8 text-gray-900 dark:text-gray-100">
            <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Vault Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CardWrapperSkeleton />
                </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        All Proposals
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TableWrapperSkeleton />
                </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Actions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ActionButtonSkeleton />
                        <ActionButtonSkeleton />
                        <ActionButtonSkeleton />
                        <ActionButtonSkeleton />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VaultDetailsPageSkeleton;
