import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Song schema
const SongSchema = z.object({
  name: z.string(),
  artists: z.array(z.string()),
});
const SongsArraySchema = z.array(SongSchema);

// Parse double-encoded JSON
function parseDoubleEncodedArrayJSON(raw) {
  let content = raw;
  if (content.startsWith('"') && content.endsWith('"')) content = content.slice(1, -1);
  content = content.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  content = content.trim();
  if (content.startsWith('{') && content.endsWith('}')) {
    const firstBracket = content.indexOf('[');
    const lastBracket = content.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      content = content.slice(firstBracket, lastBracket + 1);
    }
  }
  
  return JSON.parse(content);
}

// Batch large song lists
function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  console.log(result);
  return result;
}

export async function pickSongs(labels, tracks) {
  const BATCH_SIZE = 25; // small batch to avoid context window issues
  const MAX_SONGS_TOTAL = 10;
  
  const batches = chunkArray(Array.from([...tracks].sort(() => Math.random() - 0.5)), BATCH_SIZE);
  const SONGS_PER_BATCH = Math.ceil(MAX_SONGS_TOTAL / batches.length);

  let allParsed = [];

  for (const batch of batches) {
    const prompt = `
      You are a music curator for Instagram Stories. These stories are made by college students who are up with the trends and wants music that will make the stories Pinterest-appealing and aesthetic.. Choose songs that match the vibe and mood of the content.

      Instagram Story content:
      ${JSON.stringify(labels)}

      Choose up to ${SONGS_PER_BATCH} songs ONLY from this list that would create the perfect background mood:
      ${batch.map((s, i) => `${i + 1}. ${s}`).join('\n')}

      Consider:
      - What emotions or energy does this Story convey?
      - What songs would enhance the viewer's experience?
      - What matches the aesthetic or theme?

      ⚠️ STRICT FORMAT:
      - Return ONLY a JSON array: [{"name": "Song Title", "artists": ["Artist Name"]}]
      - NO backticks, quotes around names, or special characters
      - ONLY choose from the numbered list above
      - If no songs fit the vibe, return []
      - Use ["Unknown"] for artists if unsure
      `;

    let parsed = [];
    let attempts = 0;
    const MAX_RETRIES = 5;

    while (parsed.length === 0 && attempts < MAX_RETRIES) {
      attempts++;
      try {
        const response = await ollama.chat({
          model: 'mistral:7b-instruct',
          messages: [{ role: 'user', content: prompt }],
          format: zodToJsonSchema(SongsArraySchema),
        });

        parsed = SongsArraySchema.parse(parseDoubleEncodedArrayJSON(response.message.content));

        parsed = parsed.map(song => ({
          name: song.name.replace(/[`'"]/g, '').trim(),
          artists: song.artists.map(artist => artist.replace(/[`'"]/g, '').trim())
        }));

        // Keep only songs in the batch (extra safety)
        parsed = parsed.filter(s => batch.some(t => t.includes(s.name)));

      } catch (err) {
        console.warn(`Batch parsing failed (attempt ${attempts}), retrying...`);
      }
    }

    allParsed.push(...parsed);

    if (allParsed.length >= MAX_SONGS_TOTAL) break;
  }

  // Enforce max total songs
  if (allParsed.length > MAX_SONGS_TOTAL) allParsed = allParsed.slice(0, MAX_SONGS_TOTAL);
  console.log(allParsed);

  return allParsed;
}
