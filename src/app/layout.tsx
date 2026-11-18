import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'coy. — Discover',
  description: 'Find out if your crush likes you back.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4F4F6] text-neutral-900 flex justify-center antialiased">
        <div className="w-full max-w-md min-h-screen bg-white border-x border-neutral-200/80 flex flex-col shadow-sm relative">
          {children}
        </div>
      </body>
    </html>
  );
}
