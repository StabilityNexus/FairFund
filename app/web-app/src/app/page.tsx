import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DM_Serif_Display } from 'next/font/google';
import { cn } from '@/lib/utils';

const dmSerifDisplay = DM_Serif_Display({
    subsets: ['latin'],
    style: 'normal',
    weight: '400',
});

export default function Home() {
    return (
        <main className="bg-gradient-to-r min-h-screen from-rose-100 to-teal-100 dark:from-black dark:to-slate-600">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <h1
                    className={cn(
                        'font-semibold text-7xl text-center',
                        dmSerifDisplay.className
                    )}
                >
                    Fairfund.
                </h1>
                <div className="mt-8" />
                <div className="flex justify-center">
                    <Link href={'/dashboard'}>
                        <Button className="rounded-full">Get Started</Button>
                    </Link>
                </div>
            </div>
        </main>
    );
}
