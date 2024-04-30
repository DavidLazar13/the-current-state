import Guardian from 'guardian-js';

export default async function handler(req, res) {

  const apiKey = process.env.GUARDIAN_API_KEY;
  const guardian = new Guardian(apiKey, true);

  try {
    const { search } = req.query;
    const response = await guardian.content.search(search, {
      pageSize: 10,
      orderBy: "newest"
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: error.message });
  }
}
