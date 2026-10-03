import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Checkpoint by SIP Guardian | Intelligent SIP Decision Support",
  description:
    "Sub-2-second AI-powered decision support layer helping retail investors make informed choices about their SIP wealth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
