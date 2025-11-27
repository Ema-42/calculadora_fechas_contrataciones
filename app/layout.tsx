import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "CONTRATACIONES",
  description:
    "Creado por la Jefatura de TI del Gobierno Autónomo Municipal de Sucre",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        (function() {
          const theme = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (theme === 'dark' || (!theme && prefersDark)) {
            document.documentElement.classList.add('dark');
          }
        })()
      `,
          }}
        />
        <link rel="icon" type="image/x-icon" href="dolar.png" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

