import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/componet/Navbar";
import Footer from "@/componet/Footer";
import { ThemeProvider } from "@/componet/ThemeProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AuraGym — Elite Fitness Experience",
  description: "World-class trainers, 80+ weekly classes, and a vibrant community. Start your transformation at AuraGym today.",
  icons: {
    icon: '/logo-ag.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ scrollBehavior: 'smooth' }}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
