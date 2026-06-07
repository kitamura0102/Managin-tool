import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leadership Notebook",
  description: "A private notebook for objective coaching and performance documentation."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
