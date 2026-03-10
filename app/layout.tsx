import type { Metadata } from "next";
import "./globals.css";
import dynamic from 'next/dynamic';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const BackgroundMempool = dynamic(() => import('@/components/BackgroundMempool'), { ssr: false });

export const metadata: Metadata = {
  title: "WEB3 PROTOCOL | Documentation",
  description: "The complete documentation for the decentralized future. Learn blockchain, smart contracts, DeFi, DAOs, and more.",
  keywords: ["web3", "blockchain", "ethereum", "smart contracts", "defi", "dao", "nft", "cryptocurrency"],
  authors: [{ name: "Web3 Documentation Team" }],
  openGraph: {
    title: "WEB3 PROTOCOL | Documentation",
    description: "The complete documentation for the decentralized future.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-bg-base text-text-primary antialiased overflow-x-hidden">
        <BackgroundMempool />
        <CustomCursor />
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
