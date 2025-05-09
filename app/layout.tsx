import type { Metadata } from "next";
import "./globals.css";
import AppWrapper from "@/components/layout/AppWrapper";
import AuthProvider from "@/components/auth/auth-provider";

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
        <AuthProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </AuthProvider>
      </body>
    </html>
  );
} 