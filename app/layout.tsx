import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bmpestcontrol.ca"),
  title: "B&M Pest Control | Residential Pest Prevention in Sault Ste. Marie & Algoma",
  description: "B&M Pest Control is a residential-first, prevention-focused pest control business serving Sault Ste. Marie and surrounding Algoma communities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Header />
        <main id="top">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
