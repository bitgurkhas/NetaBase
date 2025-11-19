export async function GET() {
  const baseUrl = process.env.NEXT_FRONTEND_BASE_URL;
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/politicians/`;

  let allPoliticians: any[] = [];
  let nextPage = apiUrl;

  // Fetch ALL paginated politicians
  try {
    while (nextPage) {
      const res = await fetch(nextPage, { cache: "no-store" });
      const data = await res.json();
      console.log(data)
      allPoliticians = [...allPoliticians, ...data.results];
      nextPage = data.next; // pagination
    }
  } catch (err) {
    console.error("Failed to fetch politicians:", err);
  }

  // Static pages
  const staticUrls = [
    `${baseUrl}/home`,
    `${baseUrl}/about`,
    `${baseUrl}/party`,
    `${baseUrl}/news`,
    `${baseUrl}/events`,
  ];

  // Politician detail pages
  const politicianUrls = allPoliticians.map((p) => {
    return `${baseUrl}/politician/${p.slug}`;
  });

  const allUrls = [...staticUrls, ...politicianUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls
      .map(
        (url) => `
      <url>
        <loc>${url}</loc>
        <priority>0.8</priority>
      </url>`
      )
      .join("")}
  </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
