import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "متتبع الخدمات — لوحة التحكم",
  description: "إدارة جميع خدماتك السحابية واشتراكاتك في مكان واحد",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { borderRadius: "12px", fontSize: "13px" },
          }}
        />
      </body>
    </html>
  );
}
