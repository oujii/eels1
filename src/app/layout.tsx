import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ÅlControl Pro 2025 - Intelligent Aquaculture Management",
  description: "Futuristisk aquaculture management-dashboard för 4K touchscreens",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
