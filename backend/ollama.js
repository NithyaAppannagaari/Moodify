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
  const BATCH_SIZE = 10; // small batch to avoid context window issues
  const MAX_SONGS_TOTAL = 8;

  const batches = chunkArray(Array.from(tracks), BATCH_SIZE);
  let allParsed = [];

  for (const batch of batches) {
    const prompt = `
    You are a JSON-generating assistant.

    Labels describing an image or scene:
    ${JSON.stringify(labels)}

    Choose up to ${MAX_SONGS_TOTAL} songs ONLY from this list:
    ${batch.map((s, i) => `${i + 1}. ${s}`).join('\n')}

    ⚠️ IMPORTANT:
    - Return ONLY a JSON array of objects in this format:
    [
    { "name": "Song Title", "artists": ["Artist Name"] }
    ]
    - Do NOT invent songs not in the given list
    - Include "artists"; if unknown, use ["Unknown"]
    - Always return an array, even if empty
    `;

    let parsed = [];
    let attempts = 0;
    const MAX_RETRIES = 3;

    while (parsed.length === 0 && attempts < MAX_RETRIES) {
      attempts++;
      try {
        const response = await ollama.chat({
          model: 'mistral:7b-instruct',
          messages: [{ role: 'user', content: prompt }],
          format: zodToJsonSchema(SongsArraySchema),
        });

        parsed = SongsArraySchema.parse(parseDoubleEncodedArrayJSON(response.message.content));

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
