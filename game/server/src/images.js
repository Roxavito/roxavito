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

// A generic full-text Commons search on a query like "investigation report
// documents" happily matches any random scanned-paper or clip-art file with
// no connection to Korea at all — Commons is a huge general media library,
// not a curated Joseon-art collection. A candidate is only trusted once it
// actually looks Korean/Joseon in its own title.
const RELEVANCE_KEYWORDS = /korea|korean|joseon|choson|chosun|seoul|hanbok|goryeo|silla/i;

async function runSearch(query, { requireRelevance = false } = {}) {
  const url = new URL(COMMONS_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", query);
  url.searchParams.set("gsrnamespace", "6"); // File namespace
  url.searchParams.set("gsrlimit", "8");
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
  if (!pages) {
    // A 200 OK with zero matching pages is a completely valid, common
    // outcome (the query just didn't match anything on Commons) — but it
    // used to be indistinguishable in the logs from "this code path never
    // ran at all". Logging it turns "no image ever shows up" from a
    // guessing game into something diagnosable from Render's logs.
    console.log(`Wikimedia Commons: 0 results for "${query}"`);
    return null;
  }

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
    if (!thumb) continue;
    const title = page.title?.replace(/^File:/, "") || query;
    if (requireRelevance && !RELEVANCE_KEYWORDS.test(title)) continue;
    return { url: thumb, pageUrl: info.descriptionurl || null, title };
  }
  console.log(
    `Wikimedia Commons: ${rankedPages.length} page(s) matched "${query}" but none had a usable/relevant thumbnail`
  );
  return null;
}

export async function searchSceneImage(query) {
  const trimmed = String(query || "").trim();
  if (!trimmed) return null;

  try {
    // Tier 1: scoped to Commons' own "Joseon Dynasty" category — the most
    // reliable way to keep results genuinely Korean/historical, since
    // Commons categorizes its Korean-heritage uploads reasonably well. No
    // extra relevance check needed here — category membership already is
    // the relevance signal.
    const categorized = await runSearch(`${trimmed} incategory:"Joseon Dynasty"`);
    if (categorized) return categorized;

    // Tier 2: broader bitmap search with Korea/Joseon terms baked into the
    // query itself (regardless of exactly how the model phrased its own
    // query), but every candidate must still show a Korea/Joseon word in
    // its own title — otherwise an unrelated file that merely matched a
    // couple of keywords (e.g. a random scanned document for an
    // "investigation report" scene) could get picked, which is exactly
    // what was happening before this fix.
    const strict = await runSearch(`${trimmed} Korean Joseon filetype:bitmap`, {
      requireRelevance: true,
    });
    if (strict) return strict;

    // Tier 3: last resort, same relevance filter still applied — better to
    // show no image than a confidently wrong one.
    return await runSearch(`${trimmed} Korean Joseon`, { requireRelevance: true });
  } catch (err) {
    console.error("Scene image search failed:", err.message);
    return null;
  }
}
