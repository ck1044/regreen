import type { Metadata } from "next";
import "./globals.css";
import MobileLayout from "@/components/layout/MobileLayout";

export const metadata: Metadata = {
  title: "리그린",
  description: "모바일 웹앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <MobileLayout userRole="customer">
          {children}
        </MobileLayout>
      </body>
    </html>
  );
} 