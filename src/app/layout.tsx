import type { Metadata } from "next";
import "./globals.css";
import MobileLayout from "@/components/layout/MobileLayout";
// import AuthProvider from "@/components/auth/auth-provider";

export const metadata: Metadata = {
  title: "리그린",
  description: "리그린 프로젝트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* <AuthProvider> */}
          <MobileLayout userId={undefined}>
            {children}
          </MobileLayout>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
} 