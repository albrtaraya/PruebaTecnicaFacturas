import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/header";
import { getThemeCookie } from "@/lib/cookies";
import { InvoiceProvider } from "@/contexts/InvoiceContext";


export const metadata: Metadata = {
  title: "Prueba técnica",
  description: "Esta es una prueba técnica para un trabajo.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getThemeCookie()

  return (
    <html lang="es" className={theme === 'dark' ? 'dark' : ''}>
      <body>
        <InvoiceProvider>
          <Header />
          {children}
        </InvoiceProvider>
      </body>
    </html>
  );
}
