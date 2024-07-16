import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const StatCardSkeleton = () => (
    <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                </div>
            </div>
        </CardContent>
    </Card>
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

const VaultResultsPageSkeleton = () => {
    return (
        <div className="container mx-auto p-6 space-y-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <h1 className="text-2xl font-bold mb-6">Vault Results</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>

            <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Detailed Results
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TableWrapperSkeleton />
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white dark:bg-gray-800 flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center justify-start">
                            Post-Tally Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                        <ActionButtonSkeleton />
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center justify-start">
                            Post-Distribution Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center space-y-4">
                        <ActionButtonSkeleton />
                        <ActionButtonSkeleton />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default VaultResultsPageSkeleton;
