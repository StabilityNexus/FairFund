'use client';
import { useState } from 'react';

import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Circle from 'lucide-react/dist/esm/icons/circle';
import Search from 'lucide-react/dist/esm/icons/search';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from './ui/scroll-area';
import { type FundingVault } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const mockVaults = [
    {
        id: 1,
        description: 'Community Development Fund',
        creator: '0x1234...5678',
        tokensLocked: '1000 ETH',
        status: 'active',
    },
    {
        id: 2,
        description: 'Ecosystem Growth Initiative',
        creator: '0xabcd...efgh',
        tokensLocked: '500 ETH',
        status: 'active',
    },
    {
        id: 3,
        description: 'Research Grant Pool',
        creator: '0x9876...5432',
        tokensLocked: '750 ETH',
        status: 'inactive',
    },
    {
        id: 4,
        description: 'Community Development Fund',
        creator: '0x1234...5678',
        tokensLocked: '1000 ETH',
        status: 'active',
    },
    {
        id: 5,
        description: 'Ecosystem Growth Initiative',
        creator: '0xabcd...efgh',
        tokensLocked: '500 ETH',
        status: 'active',
    },
    {
        id: 6,
        description: 'Research Grant Pool',
        creator: '0x9876...5432',
        tokensLocked: '750 ETH',
        status: 'inactive',
    },
    {
        id: 7,
        description: 'Community Development Fund',
        creator: '0x1234...5678',
        tokensLocked: '1000 ETH',
        status: 'active',
    },
    {
        id: 8,
        description: 'Ecosystem Growth Initiative',
        creator: '0xabcd...efgh',
        tokensLocked: '500 ETH',
        status: 'active',
    },
    {
        id: 9,
        description: 'Research Grant Pool',
        creator: '0x9876...5432',
        tokensLocked: '750 ETH',
        status: 'inactive',
    },
    {
        id: 10,
        description: 'Community Development Fund',
        creator: '0x1234...5678',
        tokensLocked: '1000 ETH',
        status: 'active',
    },
    {
        id: 11,
        description: 'Ecosystem Growth Initiative',
        creator: '0xabcd...efgh',
        tokensLocked: '500 ETH',
        status: 'active',
    },
    {
        id: 12,
        description: 'Research Grant Pool',
        creator: '0x9876...5432',
        tokensLocked: '750 ETH',
        status: 'inactive',
    },
    {
        id: 13,
        description: 'Community Development Fund',
        creator: '0x1234...5678',
        tokensLocked: '1000 ETH',
        status: 'active',
    },
    {
        id: 14,
        description: 'Ecosystem Growth Initiative',
        creator: '0xabcd...efgh',
        tokensLocked: '500 ETH',
        status: 'active',
    },
    {
        id: 15,
        description: 'Research Grant Pool',
        creator: '0x9876...5432',
        tokensLocked: '750 ETH',
        status: 'inactive',
    },
];

const steps = [
    {
        title: 'Select from active funding vaults',
        description: 'Select a funding vaults to make a proposal for',
        subSteps: [],
    },
    {
        title: 'Create a Proposal',
        description: 'This will create a blockchain transaction',
        subSteps: [
            {
                title: 'Proposal Information',
                description:
                    'A clear and consice description for your proposal and additional redirect url (if any)',
                fields: ['description', 'metadata'],
            },
            {
                title: 'Request Amount',
                description:
                    'Minimum and maximum amount required by the proposal',
                fields: ['minRequestAmount', 'maxRequestAmount'],
            },
            {
                title: 'Recipent wallet address',
                description:
                    'If the proposal is accepted for the funding, the funds will be transfered to this address',
                fields: ['recipient'],
            },
            {
                title: 'Review and Submit',
                description:
                    'Carefully review all entered parameters before submitting the proposal',
                fields: [],
            },
        ],
    },
];

export default function ProposalFormWrapper() {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentProposalStep, setCurrentProposalStep] = useState(0);
    const [selectedVault, setSelectedVault] = useState<any>(null);

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleClickVault = (vault: any) => {
        if (selectedVault && vault.id === selectedVault.id) {
            setSelectedVault(null);
        } else {
            setSelectedVault(vault);
        }
    };

    return (
        <div className="h-full container mx-auto p-4">
            <div className="h-full flex flex-col md:flex-row gap-8">
                <div className="w-full lg:w-1/4 order-2 lg:order-1 lg:relative">
                    <div className="sticky md:top-0 h-full flex flex-col gap-4 justify-center">
                        {steps.map((step, index) => (
                            <div className="relative" key={index}>
                                <div className="flex items-start">
                                    <div
                                        className={`flex flex-col items-center mr-4 ${
                                            index <= currentStep
                                                ? 'text-primary'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center bg-background">
                                            {index < currentStep ? (
                                                <CheckCircle className="w-6 h-6" />
                                            ) : index === currentStep ? (
                                                <Circle className="w-5 h-5 fill-current " />
                                            ) : (
                                                <Circle className="w-6 h-6" />
                                            )}
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="w-0.5 bg-border absolute top-9 -bottom-3 left-4 -ml-px" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-medium">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                                {step.subSteps.length > 0 && (
                                    <div className="ml-12 mt-4 space-y-4">
                                        {step.subSteps.map(
                                            (subStep, subIndex) => (
                                                <div
                                                    key={subIndex}
                                                    className="flex items-start"
                                                >
                                                    <div
                                                        className={`flex flex-col items-center mr-4 {subIndex <= currentVaultFormStep ? 'text-primary' : 'text-muted-foreground'}`}
                                                    >
                                                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                                                            {subIndex <
                                                                currentProposalStep ||
                                                            index <
                                                                currentStep ? (
                                                                <CheckCircle className="w-6 h-6" />
                                                            ) : (
                                                                <span>
                                                                    {subIndex +
                                                                        1}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {subIndex <
                                                            step.subSteps
                                                                .length -
                                                                1 && (
                                                            <div className="w-0.5 h-full bg-border mt-2" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">
                                                            {subStep.title}
                                                        </h4>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full md:w-3/4 order-1 md:order-2 flex flex-col items-center">
                    {currentStep === 0 && (
                        <div className="w-full space-y-4">
                            <div className="my-6">
                                <h3 className="text-2xl font-semibold mb-2 ">
                                    {steps[0].title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {steps[0].description}
                                </p>
                            </div>
                            <div className="relative">
                                <Input
                                    type="text"
                                    placeholder="Search vaults..."
                                    className="pl-10 w-full"
                                />
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                            </div>
                            <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                                <div className="space-y-4">
                                    {mockVaults.map((vault) => (
                                        <div
                                            key={vault.id}
                                            className={cn(
                                                'p-6 border rounded-lg cursor-pointer transition-all',
                                                selectedVault?.id === vault.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border hover:border-primary hover:bg-primary/5'
                                            )}
                                            onClick={() =>
                                                handleClickVault(vault)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-semibold text-lg">
                                                    {vault.description}
                                                </h3>
                                                <Badge
                                                    variant={
                                                        vault.status ===
                                                        'active'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {vault.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                Creator: {vault.creator}
                                            </p>
                                            <p className="text-sm font-medium">
                                                Locked: {vault.tokensLocked}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            {selectedVault && (
                                <div className="mt-6">
                                    <Button
                                        onClick={nextStep}
                                        disabled={!selectedVault}
                                        className="w-full"
                                    >
                                        Continue
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
