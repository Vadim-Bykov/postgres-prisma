import Wrapper from "@/app/components/Wrapper";
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import "react-loading-skeleton/dist/skeleton.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://postgres-prisma.vercel.app"),
  title: "Vercel Postgres Demo with Prisma",
  description:
    "A simple Next.js app with Vercel Postgres as the database and Prisma as the ORM",
  themeColor: "#141024",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
