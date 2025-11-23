import { Suspense } from "react";
import Home from "@/app/home/Home";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepali Politicians Profiles & Ratings | Political Leaders of Nepal",
  description: "Explore comprehensive profiles and ratings of Nepali political leaders. Rate and review politicians in Nepal. Find information about Nepal's top political figures.",
  keywords: "nepali politicians, politicians nepal, politicians of nepal, political leaders, nepal government, political news nepal, politician ratings, new politicians, young politicians nepal, gen z politicians, generation z politicians, emerging politicians nepal, rising political leaders, politician profiles, nepal politics, political figures nepal, politician reviews, rate politicians, political candidates nepal, political movements nepal, politician performance, political analysis nepal, nepali leadership, politician tracker, political news today nepal, trending politicians, popular politicians nepal, politician information, nepal election, politician scorecard, politician voting record, nepali political leaders profile, political transparency nepal, politician accountability, nepali neta, naya nepal ,neta ratings, politician database nepal, politician insights, naya neta, naya party, nepali policitician news, neta news",
  openGraph: {
    title: "Nepali Politicians Profiles & Ratings",
    description: "Explore and rate political leaders in Nepal",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepali Politicians Profiles & Ratings",
    description: "Explore and rate political leaders in Nepal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
        <Home />
      </Suspense>
      
      {/* Schema.org structured data for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Nepali Politicians Ratings",
            "description": "A platform to explore, rate, and review Nepali political leaders",
            "url": "https://netabase.xyz",
            "applicationCategory": "ReferenceApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </>
  );
}