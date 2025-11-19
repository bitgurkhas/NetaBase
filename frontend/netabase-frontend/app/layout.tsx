import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "NetaBase",
  description: "Modern database of Nepali politicians.",
  openGraph: {
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}