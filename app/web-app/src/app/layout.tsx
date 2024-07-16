import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import '@/app/globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'FairFund',
    description:
        'FairFund is a blockchain based platform for community-driven funding. Users can deploy funding vaults, deposit funds, and submit proposals for funding. The platform uses a voting mechanism to decide which proposals receive funding.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    'min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
