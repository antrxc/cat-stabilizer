import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cognitive Load Balancer",
  description: "A system that adjusts UI complexity based on cognitive load scores to optimize operator performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-mono antialiased">
        {children}
      </body>
    </html>
  );
}
