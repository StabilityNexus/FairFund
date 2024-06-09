export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            NAVBAR
            {children}
        </main>
    );
}
