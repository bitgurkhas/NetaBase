import PoliticianDetailPage from "@/app/politician/[slug]/PoliticianDetail";

export default function Page() {
  return <PoliticianDetailPage />;
}
export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/politicians/${slug}/`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const politician = await res.json();

    return {
      title: politician.name,
      description:
        politician.bio ||
        politician.description ||
        `Learn more about ${politician.name}.`,
      openGraph: {
        title: politician.name,
        description:
          politician.bio ||
          politician.description ||
          `Details and ratings for ${politician.name}.`,
        images: [politician.image || "/og.png"],
        url: `https://netabase.vercel.app/politician/${slug}`,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: politician.name,
        description:
          politician.bio ||
          politician.description ||
          `Strong profile and analysis for ${politician.name}.`,
        images: [politician.image || "/og.png"],
      },
    };
  } catch (error) {
    return {
      title: "Politicians",
      description: "Unable to load politician details.",
    };
  }
}
