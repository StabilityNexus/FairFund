'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Vault,
    ThumbsUp,
    DollarSign,
    CheckCircle,
    LucideIcon,
} from 'lucide-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

// Types
interface Step {
    title: string;
    icon: React.ReactElement;
    description: string;
}

interface ActionCard {
    title: string;
    description: string;
    route: string;
    buttonText: string;
}

const STEPS: Step[] = [
    {
        title: 'Create a Space',
        icon: <Users size={32} className="text-purple-500" />,
        description:
            'Establish a dedicated space for community engagement and project management.',
    },
    {
        title: 'Create a Vault',
        icon: <Vault size={32} className="text-green-500" />,
        description:
            'Start by creating a vault to manage funds for community projects.',
    },
    {
        title: 'Submit a Proposal',
        icon: <ThumbsUp size={32} className="text-blue-500" />,
        description: 'Propose new projects for funding and community support.',
    },
    {
        title: 'Vote on Proposal',
        icon: <CheckCircle size={32} className="text-yellow-500" />,
        description: 'Engage the community to vote on proposed projects.',
    },
    {
        title: 'Distribute Funds',
        icon: <DollarSign size={32} className="text-yellow-500" />,
        description:
            'Allocate funds to approved projects and see their impact.',
    },
];

const ACTION_CARDS: ActionCard[] = [
    {
        title: 'Start a Vault',
        description:
            'Securely manage funds for community projects by creating your own vault.',
        route: '/create/vault',
        buttonText: 'Create Vault',
    },
    {
        title: 'Submit a Proposal',
        description:
            'Have a project idea? Submit a proposal to gain community support and funding.',
        route: '/create/proposal',
        buttonText: 'Submit Proposal',
    },
    {
        title: 'Explore Community Projects',
        description:
            'Discover impactful projects and get involved in community-driven decisions.',
        route: '/spaces',
        buttonText: 'Explore Projects',
    },
];

interface ActionCardProps {
    card: ActionCard;
    onButtonClick: (route: string) => void;
}

function ActionCardComponent({ card, onButtonClick }: ActionCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                    {card.description}
                </p>
                <Button
                    className="mt-4 w-full"
                    onClick={() => onButtonClick(card.route)}
                >
                    {card.buttonText}
                </Button>
            </CardContent>
        </Card>
    );
}

interface StepCardProps {
    step: Step;
    index: number;
}

function StepCard({ step, index }: StepCardProps) {
    return (
        <Card
            key={index}
            className="text-center w-64 shadow-lg transition-shadow duration-300"
        >
            <CardHeader className="flex flex-col items-center">
                {step.icon}
                <CardTitle className="mt-4 text-lg font-semibold">
                    {step.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                    {step.description}
                </p>
            </CardContent>
        </Card>
    );
}

export default function FeatureHighlights() {
    const { open } = useWeb3Modal();
    const { isConnected } = useAccount();
    const router = useRouter();

    const handleButtonClick = (route: string) => {
        if (isConnected) {
            router.push(route);
        } else {
            open();
        }
    };

    return (
        <div className="flex flex-col space-y-12">
            <div className="flex flex-col items-center w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                    How FairFund Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {STEPS.map((step, index) => (
                        <StepCard key={index} step={step} index={index} />
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ACTION_CARDS.map((card, index) => (
                    <ActionCardComponent
                        key={index}
                        card={card}
                        onButtonClick={handleButtonClick}
                    />
                ))}
            </div>
        </div>
    );
}
