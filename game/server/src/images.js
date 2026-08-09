// Finds a free-license, thematically-fitting image for the current scene by
// searching Wikimedia Commons (paintings, illustrations, film stills, etc.)
// — no API key, no LLM tokens spent on the actual search. The model only
// contributes a short English search-query hint (`imageQuery`); everything
// else here is a plain HTTP call.
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

// Wikimedia's User-Agent policy (meta.wikimedia.org/wiki/User-Agent_policy)
// asks for a descriptive UA with real contact info; requests missing that
// are the ones most likely to get rate-limited or flat-out 403'd,
// especially from cloud-hosting IP ranges like Render's. A bare
// "AppName/1.0 (personal project)" string doesn't satisfy that.
const USER_AGENT =
  "JoseonEmpireGame/1.0 (https://github.com/Roxavito/roxavito; personal non-commercial hobby project)";

async function runSearch(query) {
  const url = new URL(COMMONS_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrnamespace", "6"); // File namespace
  url.searchParams.set("gsrlimit", "5");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|extmetadata");
  url.searchParams.set("iiurlwidth", "600");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    // This used to fail completely silently (just `return null`), which is
    // exactly why "the image feature has never once worked" was impossible
    // to diagnose from Render's logs — there was nothing to look at. Now a
    // real failure (rate limit, User-Agent rejection, etc.) at least leaves
    // a trace with the actual status/body.
    const bodySnippet = await res.text().catch(() => "");
    console.warn(
      `Wikimedia Commons search failed (${res.status}) for "${query}":`,
      bodySnippet.slice(0, 300)
    );
    return null;
  }

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
        title: page.title?.replace(/^File:/, "") || query,
      };
    }
  }
  return null;
}

export async function searchSceneImage(query) {
  const trimmed = String(query || "").trim();
  if (!trimmed) return null;

  try {
    // Try the tighter, bitmap-only search first (paintings/photos, not
    // vector drawings). If that genuinely finds nothing — a real
    // possibility for a very specific or obscure query — retry once with
    // the plain query before giving up, instead of the scene silently
    // never getting an image over something as narrow as a filetype filter.
    const strict = await runSearch(`${trimmed} filetype:bitmap`);
    if (strict) return strict;
    return await runSearch(trimmed);
  } catch (err) {
    console.error("Scene image search failed:", err.message);
    return null;
  }
}
