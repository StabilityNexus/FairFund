'use client';
import { useEffect, useState } from 'react';
import VaultForm from '@/components/vault-form';
import SpaceForm from '@/components/space-form';
import DepositTokensForm from '@/components/desposit-tokens-form';
import type { Space, FundingVault } from '@prisma/client';

import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Circle from 'lucide-react/dist/esm/icons/circle';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { SpaceWithCount } from '@/lib/space-data';

const steps = [
    {
        title: 'Create or Select Existing Space',
        description:
            'Start by either creating a new space or selecting an existing one. This space will serve as a container for multiple vaults.',
        subSteps: [],
    },
    {
        title: 'Create Funding Vault',
        description: 'This will deploy a new funding vault smart contract.',
        subSteps: [
            {
                title: 'Basic Information',
                description:
                    'Enter a clear and concise description for your funding vault.',
                fields: ['description'],
            },
            {
                title: 'Token Configuration',
                description:
                    'Specify the addresses for both the funding token and the voting token that will be used in your vault.',
                fields: ['fundingTokenAddress', 'votingTokenAddress'],
            },
            {
                title: 'Funding Parameters',
                description:
                    'Define the funding limits (minimum and maximum requestable amounts) and set the tally date for fund distribution.',
                fields: [
                    'minRequestableAmount',
                    'maxRequestableAmount',
                    'tallyDate',
                ],
            },
            {
                title: 'Review and Submit',
                description:
                    'Carefully review all entered parameters before finalizing the vault creation.',
                fields: [],
            },
        ],
    },
    {
        title: 'Add Funds to Vault',
        description:
            'Once your vault is created, you can add funding tokens to it. This step can also be completed at a later time if needed.',
        subSteps: [],
    },
];

interface VaultFormWrapperProps {
    spaces?: SpaceWithCount[];
    fromSpacePage?: boolean;
    space?: Space;
}

export default function VaultFormWrapper({
    spaces,
    fromSpacePage = false,
    space,
}: VaultFormWrapperProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentVaultFormStep, setCurrentVaultFormStep] = useState(0);
    const [fundingVault, setFundingVault] = useState<FundingVault | null>(null);
    const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (fromSpacePage && space) {
            setSelectedSpace(space);
            setCurrentStep(1);
        }
    }, [fromSpacePage, space]);

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

    return (
        <div className="h-full container mx-auto p-4">
            <div className="h-full flex flex-col md:flex-row gap-8">
                <div className="w-full lg:w-1/4 order-2 lg:order-1 lg:relative">
                    <div className="sticky md:top-0 h-full flex flex-col gap-4 justify-center">
                        {steps.map((step, index) => (
                            <div className="relative" key={index}>
                                <div className={`flex items-start `}>
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
                                                        className={`flex flex-col items-center mr-4 ${subIndex <= currentVaultFormStep ? 'text-primary' : 'text-muted-foreground'}`}
                                                    >
                                                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                                                            {subIndex <
                                                                currentVaultFormStep ||
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
                <div className="w-full md:w-3/4 order-1 md:order-2 flex items-center">
                    {currentStep === 0 && (
                        <SpaceForm
                            spaces={spaces}
                            nextComp={nextStep}
                            selectedSpace={selectedSpace}
                            setSelectedSpace={setSelectedSpace}
                        />
                    )}
                    {currentStep === 1 && (
                        <VaultForm
                            currentVaultFormStep={currentVaultFormStep}
                            setCurrentVaultFormStep={setCurrentVaultFormStep}
                            steps={steps[1].subSteps!}
                            nextComp={nextStep}
                            prevComp={prevStep}
                            setFundingVault={setFundingVault}
                            selectedSpace={selectedSpace}
                        />
                    )}
                    {currentStep === 2 && (
                        <>
                            {fundingVault ? (
                                <DepositTokensForm
                                    vaultId={fundingVault.id}
                                    vaultAddress={fundingVault.vaultAddress}
                                    fundingTokenAddress={
                                        fundingVault.fundingTokenAddress
                                    }
                                    isCreateVault={true}
                                    vaultChainId={parseInt(
                                        fundingVault.chainId
                                    )}
                                />
                            ) : (
                                <Button
                                    variant="link"
                                    className="p-0 h-auto font-normal"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Something unexpected just happened, go to
                                    dashboard.
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
