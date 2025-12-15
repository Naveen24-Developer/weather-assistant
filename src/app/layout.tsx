import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkyCast AI - Weather Assistant",
  description: "Your friendly AI weather assistant powered by Gemini",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>🌤️</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
