import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy — Discover & Crush Match',
  description: 'Double-blind crush matching and swipe discovery for Coy.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-gray-100 flex justify-center antialiased">
        <div className="w-full max-w-md min-h-screen bg-neutral-950 border-x border-neutral-800/80 flex flex-col shadow-2xl relative">
          {children}
        </div>
      </body>
    </html>
  );
}
