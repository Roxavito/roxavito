// Finds a free-license, thematically-fitting image for the current scene by
// searching Wikimedia Commons (paintings, illustrations, film stills, etc.)
// — no API key, no LLM tokens spent on the actual search. The model only
// contributes a short English search-query hint (`imageQuery`); everything
// else here is a plain HTTP call.
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

export async function searchSceneImage(query) {
  const trimmed = String(query || "").trim();
  if (!trimmed) return null;

  const url = new URL(COMMONS_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", `${trimmed} filetype:bitmap`);
  url.searchParams.set("gsrnamespace", "6"); // File namespace
  url.searchParams.set("gsrlimit", "5");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|extmetadata");
  url.searchParams.set("iiurlwidth", "600");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "JoseonEmpireGame/1.0 (personal project)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages;
    if (!pages) return null;

    // `pages` is a plain object keyed by numeric page ID. JS engines always
    // iterate integer-like object keys in ascending numeric order, NOT in
    // the search-relevance order MediaWiki actually returned them in — so
    // without re-sorting by the API's own `index` field, the "first" result
    // picked below is essentially arbitrary rather than the best match.
    const rankedPages = Object.values(pages).sort(
      (a, b) => (a?.index ?? 0) - (b?.index ?? 0)
    );

    for (const page of rankedPages) {
      const info = page?.imageinfo?.[0];
      const thumb = info?.thumburl;
      if (thumb) {
        return {
          url: thumb,
          pageUrl: info.descriptionurl || null,
          title: page.title?.replace(/^File:/, "") || trimmed,
        };
      }
    }
    return null;
  } catch (err) {
    console.error("Scene image search failed:", err.message);
    return null;
  }
}
