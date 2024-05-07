import Guardian from 'guardian-js';

/**
 * API handler for fetching articles from The Guardian API.
 */
export default async function handler(req, res) {
  // Retrieve the API key from environment variables.
  const apiKey = process.env.GUARDIAN_API_KEY;
  // Create an instance of the Guardian API client.
  const guardian = new Guardian(apiKey, true); // The second parameter `true` enables logging.

  try {
    // Extract the 'search' query parameter from the request.
    const { search } = req.query;
    // Make a search request to The Guardian API with specified parameters.
    const response = await guardian.content.search(search, {
      pageSize: 126,  // The number of articles to return.
      orderBy: "newest"  // Order the results by the newest articles first.
    });

    // Send a successful response back with the fetched data.
    res.status(200).json(response);
  } catch (error) {
    // Log the error and send a 500 server error response with the error message.
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: error.message });
  }
}
