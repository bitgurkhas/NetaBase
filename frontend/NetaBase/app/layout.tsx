import type { Metadata } from "next";
import { Script } from "next/script";
import "@/app/globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  applicationName: "NetaBase",
  manifest: "/manifest.json",
  metadataBase: new URL("https://netabase.xyz"),
  title: {
    default:
      "NetaBase - Database of Nepali Politicians | Biography, Records & Ratings",
    template: "%s | NetaBase",
  },
  description:
    "Comprehensive database of Nepali politicians featuring detailed biographies, educational backgrounds, age, criminal records, criticisms, and public ratings. Make informed decisions about Nepal's political leaders.",
  keywords: [
    "Nepali politicians",
    "Nepal politics",
    "politician database Nepal",
    "Nepal political leaders",
    "politician biography Nepal",
    "Nepal election information",
    "politician criminal records Nepal",
    "rate politicians Nepal",
    "Nepal government officials",
    "political transparency Nepal",
    "NetaBase",
  ],
  authors: [{ name: "Bit Gurkhas" }],
  creator: "Bit Gurkhas",
  publisher: "Bit Gurkhas",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ne_NP"],
    url: "https://netabase.xyz",
    siteName: "NetaBase",
    title: "NetaBase - Database of Nepali Politicians",
    description:
      "Comprehensive database of Nepali politicians with biographies, criminal records, education details, and public ratings. Transparent information about Nepal's political leaders.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "NetaBase - Database of Nepali Politicians",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NetaBase - Complete Database of Nepali Politicians",
    description:
      "Comprehensive database of Nepali politicians with biographies, criminal records, and public ratings.",
    images: ["/og.png"],
    creator: "@bitgurkhas",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "jADqzkvJYp71qx_4aJ-JFhHR60VYhTjLPz7Z2h_uZF0",
  },
  alternates: {
    canonical: "https://netabase.xyz",
    languages: {
      en: "https://netabase.xyz",
    },
  },
  category: "politics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://netabase.xyz/" />
        <meta name="theme-color" content="#ffffff" />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6VWZFWHZTR"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-6VWZFWHZTR');
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}