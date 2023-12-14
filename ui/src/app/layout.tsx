import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat2Print",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/c2pLogo.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/c2pLogo.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/c2pLogo.png",
    },
    {
      rel: "manifest",
      url: "/c2pLogo.png",
    },
    {
      rel: "mask-icon",
      url: "/c2pLogo.png",
      color: "#5bbad5",
    },
  ],

  description:
    "Print your GPT creations on phone cases, mousepads, hoodies and more!",
};

const Container = {
  display: "flex",
  // flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
  width: "100%",
  padding: "0 0.5rem",
  fontSize: "calc(10px + 2vmin)",
  fontFamily: inter.toString(),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link
        rel="icon"
        href="/c2pLogo.png"
        style={{ width: "60px", height: "60px" }}
      />
      <body className={`bg-background ${inter.className}`}>
        <Header />
        <div style={Container}>
          {children}
          <Toaster />
        </div>
        <Footer />
      </body>
    </html>
  );
}
