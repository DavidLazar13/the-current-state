import { OpenAI } from 'openai';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{
          "role": "user",
          "content": `Compose a concrete poem reflecting the current dystopian state of the world, infusing it with a tone of hope and optimism. Write it as if you are an AI writing for humanity. Make sure it contains at least 50 characters.

**Formatting Requirements**:
- HTML: Use the < pre> tag exclusively to ensure the text is arranged as concrete poetry.
- Corrupted Text: Add corrupted characters to represent digital decay or disruption while keeping the poem readable. Ensure these characters are used in addition to normal words and do not replace them entirely.
- Unicode Artifacts: Add digital or Unicode artifacts to enhance the visual presentation, but prioritize text content.
- Zalgo Text: Ensure that Zalgo text is prominently featured to enhance the visual presentation of digital decay, making the corrupted appearance noticeable and significant. It should complement the normal words and not replace them.

**Restrictions**:
- The poem must contain a high percentage of actual words with meaningful text.
- Avoid images, emojis, and changes to font-family, font size, or color.

**Output**:
- Provide only the formatted poem, without any additional explanations.

**IMPORTANT**:
- Maintain clear readability.
- Ensure the poem remains comprehensible despite disruptions.
`
        }],
        max_tokens: 1200
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
