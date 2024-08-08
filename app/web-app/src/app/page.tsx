import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DM_Serif_Display, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Users from 'lucide-react/dist/esm/icons/users';
import Lightbulb from 'lucide-react/dist/esm/icons/lightbulb';

const dmSerifDisplay = DM_Serif_Display({
    subsets: ['latin'],
    style: 'normal',
    weight: '400',
});

const inter = Inter({ subsets: ['latin'] });

const FeatureCard = ({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition-all duration-300">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
);

export default function Home() {
    return (
        <main
            className={cn(
                'bg-gradient-to-r min-h-screen  from-[#8baaaa] to-[#ae8b9c] dark:from-[#243949] dark:to-[#517fa4] flex justify-center items-center',
                inter.className
            )}
        >
            <div className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1
                        className={cn(
                            'font-bold text-6xl md:text-7xl mb-4',
                            dmSerifDisplay.className
                        )}
                    >
                        FairFund
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8">
                        Empowering communities through on-chain funding.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <FeatureCard
                        icon={
                            <ShieldCheck className="w-12 h-12 text-teal-500" />
                        }
                        title="Secure Funding Vaults"
                        description="Deploy and manage funding vaults with on-chain governance."
                    />
                    <FeatureCard
                        icon={<Users className="w-12 h-12 text-rose-500" />}
                        title="Community-Driven"
                        description="Submit and vote on proposals, ensuring fair and transparent fund allocation."
                    />
                    <FeatureCard
                        icon={
                            <Lightbulb className="w-12 h-12 text-yellow-500" />
                        }
                        title="Innovative Projects"
                        description="Support and fund groundbreaking ideas within your community."
                    />
                </div>
                <div className="w-full flex justify-center">
                    <Link href="/dashboard" className="">
                        <Button className="rounded-full text-lg px-8 py-6">
                            Get Started <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
