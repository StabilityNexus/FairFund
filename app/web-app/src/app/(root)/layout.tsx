import Navbar from '@/components/navbar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-full">
            <Navbar />
            <main className="pt-[70px] h-full">{children}</main>
        </div>
    );
}
