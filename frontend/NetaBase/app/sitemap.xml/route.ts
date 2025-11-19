export async function GET() {
  const baseUrl = process.env.NEXT_FRONTEND_BASE_URL;
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/politicians`;

  let politicians = [];
  try {
    const res = await fetch(apiUrl);
    politicians = await res.json();
  } catch (err) {
    console.error("Failed to fetch politicians:", err);
  }

  const staticUrls = [
    `${baseUrl}/home`,
    `${baseUrl}/about`,
    `${baseUrl}/party`,
    `${baseUrl}/news`,
    `${baseUrl}/events`,
  ];

  const politicianUrls = politicians.map((p: any) => {
    return `${baseUrl}/politicians/${p.slug}`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${[...staticUrls, ...politicianUrls]
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
