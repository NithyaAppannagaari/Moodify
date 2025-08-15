import ollama from 'ollama';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

const Genres = z.object({
    name: z.string()
});

export default async function getGenres(labels, genres) {
    console.log("in here")
    const response = await ollama.chat({
        model: 'llama3.1',
        messages: [{ role: 'user', content: `Choose one or more genres from this list: ${genres.join(", ")}. The genres you choose should describe songs that encapsulate an image with these items: ${labels.join(', ')}. You must return at least one genre.` }],
        format: zodToJsonSchema(Genres),
    });

    console.log(response);
    
    const filteredGenres = Genres.parse(JSON.parse(response.message.content));

    return filteredGenres
}

