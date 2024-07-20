'use client';
import { useState } from 'react';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import VaultForm from '@/components/vault-form';

const steps = [
    {
        title: 'Create or Select Existing Space',
        description:
            'This will create a new space in which you can add multiple vaults.',
    },
    {
        title: 'Create Funding Vault',
        description: 'This will deploy a new funding vault smart contract.',
    },
    {
        title: 'Add Funds to Vault',
        description:
            'Add funding tokens to the vault (you can do it later as well).',
    },
];

const createVaultSteps = [
    {
        title: 'Basic Information',
        description: 'Provide a description for your funding vault.',
        fields: ['description'],
    },
    {
        title: 'Token Configuration',
        description: 'Set up the funding and voting tokens for your vault.',
        fields: ['fundingTokenAddress', 'votingTokenAddress'],
    },
    {
        title: 'Funding Parameters',
        description: 'Define the funding limits and distribution date.',
        fields: ['minRequestableAmount', 'maxRequestableAmount', 'tallyDate'],
    },
    {
        title: 'Review and Submit',
        description: 'Review all the parameters before submitting',
        fields: [],
    },
];

export default function VaultFormWrapper() {
    const [currentStep, setCurrentStep] = useState(0);
    const [currentVaultFormStep, setCurrentVaultFormStep] = useState(0);

    const nextStep = async () => {
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
                        {steps.map((step, index) => {
                            if (step.title === 'Create Funding Vault') {
                                return (
                                    <div
                                        className="w-full space-y-4"
                                        key={index}
                                    >
                                        <div className="space-y-2 mb-6">
                                            <h3 className="text-lg font-medium">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </div>
                                        <div className="space-y-8">
                                            {createVaultSteps.map(
                                                (vaultStep, vaultIndex) => (
                                                    <div
                                                        key={vaultIndex}
                                                        className="flex items-start"
                                                    >
                                                        <div
                                                            className={`flex flex-col items-center mr-4 ${vaultIndex <= currentVaultFormStep ? 'text-primary' : 'text-muted-foreground'}`}
                                                        >
                                                            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                                                                {vaultIndex <
                                                                currentVaultFormStep ? (
                                                                    <CheckCircle className="w-6 h-6" />
                                                                ) : (
                                                                    <span>
                                                                        {vaultIndex +
                                                                            1}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {vaultIndex <
                                                                createVaultSteps.length -
                                                                    1 && (
                                                                <div className="w-0.5 h-full bg-border mt-2" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium">
                                                                {
                                                                    vaultStep.title
                                                                }
                                                            </h4>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div
                                        className="w-full space-y-4"
                                        key={index}
                                    >
                                        <div className="space-y-2 mb-6">
                                            <h3 className="text-lg font-medium">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
                <div className="w-full md:w-3/4 order-1 md:order-2 flex items-center">
                    {currentStep === 1 && (
                        <VaultForm
                            currentVaultFormStep={currentVaultFormStep}
                            setCurrentVaultFormStep={setCurrentVaultFormStep}
                            steps={createVaultSteps}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}