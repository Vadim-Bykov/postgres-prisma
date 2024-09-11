import Wrapper from "@/app/_components/main-layout/Wrapper";
import "./globals.css";
import { Metadata } from "next";
import "react-loading-skeleton/dist/skeleton.css";
import localFont from "next/font/local";
import { BRAND_NAME_STRING } from "@/app/constants/brand";

export const metadata: Metadata = {
  title: `${BRAND_NAME_STRING} поможет Вам найти себя в этой жизни`,
  description: "Я помогу Вам найти себя в этой жизни",
  themeColor: "#141024",
  keywords: "астрология, прогнозирование, помощь",
};

const mainFont = localFont({
  src: "../public/fonts/Onest/Regular.ttf",
  display: "swap",
});

const headerFont = localFont({
  src: "../public/fonts/Geologica/Regular.ttf",
  display: "swap",
  variable: "--font-head",
});

const logoFont = localFont({
  src: "../public/fonts/KingthingsPetrock/Regular.ttf",
  display: "swap",
  variable: "--font-logo",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${mainFont.className} ${headerFont.variable} ${logoFont.variable}`}
      >
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
