/**
 * Central map of the Black Bulls design assets.
 *
 * These point at the Figma CDN export URLs (node 19491:37232). Figma export
 * URLs expire ~7 days after they're generated, so if images stop loading,
 * re-export them from Figma (or vendor them locally into /public) and update
 * the paths here — this is the single place to change them.
 */
export const ASSETS = {
  heroBg: 'https://www.figma.com/api/mcp/asset/70184c39-c1f2-44b3-9528-6a5b1e768eb7',
  bullPhoto: 'https://www.figma.com/api/mcp/asset/946c8d52-6a8b-4aa5-9253-88874c954783',
  headlineBull: 'https://www.figma.com/api/mcp/asset/b386e21c-d44b-40ad-8b90-e9ca2d661490',
  logo: 'https://www.figma.com/api/mcp/asset/981af1fe-d4fc-4243-aa4d-dc90d476ffe9',
  infoBlur: 'https://www.figma.com/api/mcp/asset/5d2ca5fa-9b9a-4d98-a49f-3fd5c9580741',
  infoSharp: 'https://www.figma.com/api/mcp/asset/293e77d3-febe-4642-8c14-d81702ab47a9'
};
