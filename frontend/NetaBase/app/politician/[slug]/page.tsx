import PoliticianDetailPage from "@/app/politician/[slug]/PoliticianDetail";

export default function Page() {
  return <PoliticianDetailPage />;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/politicians/${slug}/`, {
      cache: "no-store",
    });
    const politician = await res.json();

    return {
      title: `${politician.name} – NetaBase`,
      description: politician.bio || politician.description || `Learn more about ${politician.name}.`,
      openGraph: {
        title: `${politician.name} – NetaBase`,
        description:
          politician.bio || politician.description || `Details and ratings for ${politician.name}.`,
        images: [
          politician.image ? politician.image : "/og.png",
        ],
        url: `https://netabase.vercel.app/politician/${slug}`,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${politician.name} – NetaBase`,
        description:
          politician.bio || politician.description || `Strong profile and analysis for ${politician.name}.`,
        images: [
          politician.image ? politician.image : "/og.png",
        ],
      },
    };
  } catch (error) {
    return {
      title: "Politician Not Found – NetaBase",
      description: "Unable to load politician details.",
    };
  }
}
