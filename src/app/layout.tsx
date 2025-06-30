import "./globals.css";
import { Montserrat } from 'next/font/google'
import Link from "next/link";

import { AuthProvider } from '../context/AuthContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: [
    '100', // Thin
    '200', // ExtraLight
    '300', // Light
    '400', // Regular
    '500', // Medium
    '600', // SemiBold
    '700', // Bold
    '800', // ExtraBold
    '900'  // Black
  ],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={montserrat.className}>
        <AuthProvider>
          <header className="titulo-principal">
            <Link href="/dashboard">
              <h1>Quadro de Comunicação Técnica</h1>
            </Link>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
