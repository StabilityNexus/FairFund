'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Users,
    Vault,
    ScrollText,
    Vote,
    Banknote,
    PlusCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Step {
    title: string;
    icon: React.ReactElement;
    description: string;
    color: string;
}

const STEPS: Step[] = [
    {
        title: 'Create a Space',
        icon: <Users size={24} className="text-primary" />,
        description:
            'Set up your community space with customized governance rules and engagement features.',
        color: 'bg-primary/10 dark:bg-primary/20',
    },
    {
        title: 'Setup Vault',
        icon: <Vault size={24} className="text-emerald-500" />,
        description:
            'Configure a secure vault with multi-sig capabilities to manage community funds.',
        color: 'bg-emerald-100/50 dark:bg-emerald-500/20',
    },
    {
        title: 'Create Proposal',
        icon: <ScrollText size={24} className="text-blue-500" />,
        description:
            'Draft detailed proposals for projects, initiatives, or fund allocations.',
        color: 'bg-blue-100/50 dark:bg-blue-500/20',
    },
    {
        title: 'Community Vote',
        icon: <Vote size={24} className="text-amber-500" />,
        description:
            'Participate in democratic decision-making through secure on-chain voting.',
        color: 'bg-amber-100/50 dark:bg-amber-500/20',
    },
    {
        title: 'Fund Distribution',
        icon: <Banknote size={24} className="text-rose-500" />,
        description:
            'Automated and transparent distribution of funds to approved proposals.',
        color: 'bg-rose-100/50 dark:bg-rose-500/20',
    },
];

function StepCard({ step, index }: { step: Step; index: number }) {
    return (
        <div className={`flex items-start gap-4 p-6 rounded-lg ${step.color}`}>
            <div className="bg-background rounded-full p-2 shadow-sm">
                {step.icon}
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        Step {index + 1}
                    </span>
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                    {step.description}
                </p>
            </div>
        </div>
    );
}

export default function LowActivityDashboard() {
    return (
        <div className="space-y-8">
            <Card>
                <CardContent className="p-8">
                    <div className="flex flex-col space-y-4">
                        <p className="text-lg">
                            Start your journey by creating a vault or exploring
                            community spaces.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href={'/create/vault'}>
                                <Button
                                    variant="secondary"
                                    className="flex items-center gap-2"
                                >
                                    <PlusCircle size={20} /> Create Your First
                                    Vault
                                </Button>
                            </Link>
                            <Link href={'/spaces'}>
                                <Button
                                    variant="outline"
                                    className="bg-black text-white border-white/20 hover:bg-white/20"
                                >
                                    Explore Spaces
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">How It Works</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {STEPS.map((step, index) => (
                            <StepCard key={index} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
