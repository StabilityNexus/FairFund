'use client';
import { useEffect, useState } from 'react';

import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Circle from 'lucide-react/dist/esm/icons/circle';

import { type FundingVault } from '@prisma/client';
import SelectVault from '@/components/select-vault';
import ProposalForm from '@/components/proposal-form';

const steps = [
    {
        title: 'Select an Active Funding Vault',
        description:
            'Choose a funding vault for which you want to create a proposal.',
        subSteps: [],
    },
    {
        title: 'Create a Proposal',
        description: 'This action will initiate a blockchain transaction.',
        subSteps: [
            {
                title: 'Proposal Information',
                description:
                    'Provide a clear and concise description of your proposal, along with an additional redirect URL (if applicable).',
                fields: ['description', 'metadata'],
            },
            {
                title: 'Request Amount',
                description:
                    'Specify the minimum and maximum funding amounts required for your proposal.',
                fields: ['minRequestAmount', 'maxRequestAmount'],
            },
            {
                title: 'Recipient Wallet Address',
                description:
                    'Enter the wallet address where funds will be transferred if the proposal is accepted for funding.',
                fields: ['recipient'],
            },
            {
                title: 'Review and Submit',
                description:
                    'Carefully review all entered parameters before submitting your proposal.',
                fields: [],
            },
        ],
    },
];

interface ProposalFormInterface {
    fundingVaults?: FundingVault[];
    fromVaultPage?: boolean;
    vault?: FundingVault;
}

export default function ProposalFormWrapper({
    fundingVaults,
    fromVaultPage = false,
    vault,
}: ProposalFormInterface) {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentProposalStep, setCurrentProposalStep] = useState(0);
    const [selectedVault, setSelectedVault] = useState<FundingVault | null>(
        null
    );

    useEffect(() => {
        if (fromVaultPage && vault) {
            setSelectedVault(vault);
            setCurrentStep(1);
        }
    }, []);

    function nextStep() {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    }

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
                        <SelectVault
                            nextStep={nextStep}
                            fundingVaults={fundingVaults}
                            title={steps[currentStep].title}
                            description={steps[currentStep].description}
                            selectedVault={selectedVault}
                            setSelectedVault={setSelectedVault}
                        />
                    )}
                    {currentStep === 1 && (
                        <ProposalForm
                            fromVaultPage={fromVaultPage}
                            steps={steps[1].subSteps}
                            currentProposalStep={currentProposalStep}
                            setCurrentProposalStep={setCurrentProposalStep}
                            prevComp={prevStep}
                            fundingVault={selectedVault!}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
