import Wrapper from "@/app/components/Wrapper";
import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import "react-loading-skeleton/dist/skeleton.css";
import { BRAND_NAME_STRING } from "./constants/brand";

export const metadata: Metadata = {
  title: `${BRAND_NAME_STRING} поможет Вам найти себя в этой жизни`,
  description: "Я помогу Вам найти себя в этой жизни",
  themeColor: "#141024",
  keywords: "астрология, прогнозирование, помощь",
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
