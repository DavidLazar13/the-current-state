import { OpenAI } from 'openai';

// Constants for retry logic
const MAX_RETRIES = 3;
const BACKOFF_DELAY = 1000; // Initial delay of 1 second.

/**
 * API handler function to generate poems using the OpenAI API.
 * It retries requests up to a maximum specified count if the initial attempt fails.
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Initialize the OpenAI client with the API key from environment variables.
    const openai = new OpenAI({
      apiKey: process.env.OPEN_API_KEY,
    });

    /**
     * Recursive function to attempt to generate a poem using OpenAI,
     * retrying with exponential backoff on failure.
     */
    const generatePoem = async (attempt = 1) => {
      try {
        // Sending a request to the OpenAI API to generate a poem based on a detailed prompt.
        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [{
            role: "user",
            content: `Compose a concrete poem reflecting the current dystopian state of the world, infusing it with a tone of hope and optimism. Write it as if you are an AI writing for humanity. Make sure it contains at least 50 characters.

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
            - Ensure the poem remains comprehensible despite disruptions.`,
          }],
          max_tokens: 3000
        });

        // Successfully send the response back to the client with the generated poem.
        res.status(200).json({ result: response.choices[0].message });
      } catch (error) {
        console.error(`OpenAI error on attempt ${attempt}:`, error);

        if (attempt < MAX_RETRIES) {
          // If the attempt fails, retry with an exponential backoff delay.
          const retryDelay = BACKOFF_DELAY * Math.pow(2, attempt - 1);
          setTimeout(() => generatePoem(attempt + 1), retryDelay);
        } else {
          // If all attempts fail, send a 500 server error response.
          res.status(500).json({ error: 'Error generating prompt after multiple attempts' });
        }
      }
    };

    // Initiate the poem generation process.
    await generatePoem();
  } else {
    // If the request method is not POST, respond with a 405 Method Not Allowed.
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
