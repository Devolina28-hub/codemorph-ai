import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeMorph AI | AI-Powered Programming Platform",
  description: "Learn, convert, debug, and execute code with the power of AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f172a] text-slate-50 min-h-screen flex`}>
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen relative overflow-hidden">
          {/* Subtle background glow effect */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none z-0" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none z-0" />
          
          <div className="relative z-10 p-8 h-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
