import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo App - Tugas #7',
  description: 'Integrasi Frontend & Backend Todo Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50/50 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
