import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat2Print",
  description:
    "Print your GPT creations on phone cases, mousepads, hoodies and more!",
};

const Container = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
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
      <body className={inter.className}>
        <Header />
        <div style={Container}>{children}</div>
        <Footer />
      </body>
    </html>
  );
}
