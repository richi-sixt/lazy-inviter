import type { Metadata } from "next";
import { cormorantGaramond, oswald, nunito } from "./fonts";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Geburtstags-Einladung",
  description: "Erstelle personalisierte Kindergeburtstags-Einladungen mit KI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${cormorantGaramond.variable} ${oswald.variable} ${nunito.variable}`}
    >
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
