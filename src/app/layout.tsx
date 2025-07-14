import "./globals.css";
import { Montserrat } from 'next/font/google'
import Link from "next/link";

import { AuthProvider } from '../context/AuthContext';
import Image from "next/image";
import Head from "next/head";

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

export const metadata = {
  title: 'Quadro de Chamados Técnicos',
  description: 'Sem Descrição',
};

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
              <Image
                src="/img/logo_batalhao.jpg"
                alt="logo do batalhão"
                width={85}
                height={85}
              />
            </Link>
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
