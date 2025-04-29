import { Geist, Geist_Mono } from "next/font/google";
import { ReduxProvider } from '@/stores/store-provider.jsx';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

import "@/styles/reset.css";
import "@/styles/global.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SoruAI",
  description: "SoruAI Application",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/* <Head>
        <link 
          rel="preload" 
          href="/_next/static/css/app/page.css" 
          as="style" 
          fetchpriority="high" 
        />
      </Head> */}
      <body className="container" suppressHydrationWarning>
        <ReduxProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}