// Finds a real, freely-licensed image for the current scene on Wikimedia
// Commons — no API key, no LLM tokens spent on the search itself. This used
// to run a live full-text search built from a free-text hint the model
// wrote itself, which repeatedly turned up thematically unrelated files
// (Commons is a huge general media library, and a query like "investigation
// report documents" happily matches any random scanned-document photo with
// no connection to Korea at all).
//
// Instead, the model now picks one of a small fixed set of scene categories
// (see systemPrompt.js's `imageCategory` field), and each one maps here to
// real, hand-verified, well-populated Wikimedia Commons categories — found
// via research, not guessed — so every search is scoped to genuinely
// Joseon-era Korean material from the start, regardless of how the current
// scene happens to be phrased.
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

const USER_AGENT =
  "JoseonEmpireGame/1.0 (https://github.com/Roxavito/roxavito; personal non-commercial hobby project)";

// Each entry is an ordered list of real Commons categories to try in turn
// (first match wins). Verified to exist and be populated via research:
// - Irworobongdo: the iconic "Sun, Moon and Five Peaks" screen behind every
//   Joseon throne — reliably throne-hall imagery.
// - Gyeongbokgung / Changdeokgung / Architecture of the Joseon Dynasty:
//   the actual royal palaces.
// - Generals of the Joseon Dynasty (under People of the Joseon Dynasty).
// - Shin Yun-bok: the Joseon genre painter best known for scenes of
//   everyday/market life; "Joseon Dynasty" itself also holds market-life
//   files (e.g. "Old korea market.jpg", "Peddler merchants of Joseon
//   Dynasty").
// - Uigwe: the ~3,895-volume illustrated record of Joseon royal rituals
//   and ceremonies.
// - Kings of Joseon / People of the Joseon Dynasty: portraiture.
// - Paintings of the Joseon Dynasty / Art of the Joseon Dynasty: general
//   court/indoor scenes that don't fit a narrower bucket.
// - Ilseongnok ("daily record" of the Joseon court) / Munjado: documents,
//   letters, calligraphy.
const CATEGORY_MAP = {
  throne_hall: ["Irworobongdo", "Gyeongbokgung"],
  military: ["Generals of the Joseon Dynasty", "Joseon Dynasty"],
  market: ["Shin Yun-bok", "Joseon Dynasty"],
  ceremony: ["Uigwe"],
  portrait: ["Kings of Joseon", "People of the Joseon Dynasty"],
  palace: ["Gyeongbokgung", "Architecture of the Joseon Dynasty", "Changdeokgung"],
  private_meeting: ["Paintings of the Joseon Dynasty", "Art of the Joseon Dynasty"],
  document: ["Ilseongnok", "Munjado"],
};

async function fetchCategoryImages(commonsCategory) {
  const url = new URL(COMMONS_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("generator", "categorymembers");
  url.searchParams.set("gcmtitle", `Category:${commonsCategory}`);
  url.searchParams.set("gcmtype", "file");
  url.searchParams.set("gcmlimit", "30");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url");
  url.searchParams.set("iiurlwidth", "600");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");

  const res = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    const bodySnippet = await res.text().catch(() => "");
    console.warn(
      `Wikimedia Commons category fetch failed (${res.status}) for "${commonsCategory}":`,
      bodySnippet.slice(0, 300)
    );
    return [];
  }

  const data = await res.json();
  const pages = data?.query?.pages;
  if (!pages) {
    console.log(`Wikimedia Commons: category "${commonsCategory}" returned no members`);
    return [];
  }

  return Object.values(pages)
    .map((page) => {
      const info = page?.imageinfo?.[0];
      if (!info?.thumburl) return null;
      return {
        url: info.thumburl,
        pageUrl: info.descriptionurl || null,
        title: page.title?.replace(/^File:/, "") || commonsCategory,
      };
    })
    .filter(Boolean);
}

export async function searchSceneImage(category) {
  const key = String(category || "").trim().toLowerCase();
  const commonsCategories = CATEGORY_MAP[key];
  if (!commonsCategories) {
    if (key) console.log(`[imageCategory] "${key}" is not a recognized category, skipping`);
    return null;
  }

  try {
    for (const commonsCategory of commonsCategories) {
      const candidates = await fetchCategoryImages(commonsCategory);
      if (candidates.length === 0) continue;
      // Random pick within the category, so repeated uses of the same
      // scene category (e.g. several "market" scenes across a session)
      // don't always show the exact same picture.
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    return null;
  } catch (err) {
    console.error("Scene image search failed:", err.message);
    return null;
  }
}
