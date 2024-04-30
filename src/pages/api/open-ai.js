import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": `Write a poem about the current distopic state of the world but in a very hopeful and optimistic way.`}],
        max_tokens: 500
      });
      res.status(200).json({ result: response.choices[0].message });
    } catch (error) {
      console.error('OpenAI error:', error);
      res.status(500).json({ error: 'Error generating prompt' });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
