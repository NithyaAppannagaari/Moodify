export async function fetchOllamaResponse(labels: string[], localhost: string): Promise<string | null> {
    const prompt = `Generate words that can be used to describe songs that encapsulate an image with these items: ${labels.join(', ')}. Keep it short and use words that elicit the mood or vibe of an image with these objects.`;
  
    try {
      const response = await fetch(`http://${localhost}:11434/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          stream: false,
        }),
      });
  
      const data = await response.json();
      console.log('Ollama response:', data.message.content);
      return data.message.content;
    } catch (error) {
      console.error('Error calling Ollama:', error);
      return null;
    }
  }
  