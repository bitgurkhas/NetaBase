export const revalidate = 86400;

export default async function sitemap() {
  const baseUrl = process.env.NEXT_FRONTEND_BASE_URL!;
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/politicians/`;

  let allPoliticians: any[] = [];
  let nextPage = apiUrl;

  // Fetch all paginated politicians
  while (nextPage) {
    const res = await fetch(nextPage, {
      next: { revalidate: 3600 }, // allow static generation
    });

    const data = await res.json();
    allPoliticians = [...allPoliticians, ...data.results];
    nextPage = data.next;
  }

  // Static URLs
  const staticUrls = [
    `${baseUrl}/home`,
    `${baseUrl}/about`,
    `${baseUrl}/party`,
    `${baseUrl}/news`,
    `${baseUrl}/events`,
  ].map((url) => ({
    url,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic politician URLs
  const politicianUrls = allPoliticians.map((p) => ({
    url: `${baseUrl}/politician/${p.slug}`,
    lastModified: new Date().toISOString(),
  }));

  return [...staticUrls, ...politicianUrls];
}
