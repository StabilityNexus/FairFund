"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, Vault, ThumbsUp, DollarSign, CheckCircle } from 'lucide-react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

interface Step {
    title: string;
    icon: JSX.Element;
    description: string;
}

export default function FeatureHighlights() {
    const {open}=useWeb3Modal();
    const {isConnected}=useAccount();
    const router=useRouter();

    const steps: Step[] = [
        { 
            title: 'Create a Space', 
            icon: <Users size={32} className="text-purple-500" />, 
            description: 'Establish a dedicated space for community engagement and project management.' 
        },
        { 
            title: 'Create a Vault', 
            icon: <Vault size={32} className="text-green-500" />, 
            description: 'Start by creating a vault to manage funds for community projects.' 
        },
        { 
            title: 'Submit a Proposal', 
            icon: <ThumbsUp size={32} className="text-blue-500" />, 
            description: 'Propose new projects for funding and community support.' 
        },
        { 
            title: 'Vote on Proposal', 
            icon: <CheckCircle size={32} className="text-yellow-500" />, 
            description: 'Engage the community to vote on proposed projects.' 
        },
        { 
            title: 'Distribute Funds', 
            icon: <DollarSign size={32} className="text-yellow-500" />, 
            description: 'Allocate funds to approved projects and see their impact.' 
        },
    ];
    

    const handleButtonClick=(route:string)=>{
        if(isConnected){
            router.push(route);
        }else{
            open();
        }
    }

    return (
        <div className='flex flex-col'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>Start a Vault</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                        Securely manage funds for community projects by creating your own vault.
                    </p>
                    <Link href="/create/vault">
                        <Button className="mt-4 w-full"
                        onClick={()=> handleButtonClick('/create/vault')}>Create Vault</Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>Submit a Proposal</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                        Have a project idea? Submit a proposal to gain community support and funding.
                    </p>
                    <Link href="/create-proposal">
                        <Button className="mt-4 w-full"
                          onClick={() => handleButtonClick('/create/proposal')}>Submit Proposal</Button>
                    </Link>
                </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>Explore Community Projects</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                        Discover impactful projects and get involved in community-driven decisions.
                    </p>
                    <Link href="/explore-projects">
                        <Button className="mt-4 w-full"
                         onClick={() => handleButtonClick('/spaces')}>Explore Projects</Button>
                    </Link>
                </CardContent>
            </Card>          
        </div>

        <div className="mt-12 flex flex-col items-center w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                How FairFund Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-4">
                {steps.map((step, index) => (
                    <Card key={index} className="text-center w-64 shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex flex-col items-center">
                            {step.icon}
                            <CardTitle className="mt-4 text-lg font-semibold">{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 dark:text-gray-400">
                                {step.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
        </div>
    );
}
