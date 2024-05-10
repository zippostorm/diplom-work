import type { NextApiRequest, NextApiResponse } from "next";

import { searchPostsQuery } from "../../../utils/queries";
import { client } from "../../../utils/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const searchTerm = typeof req.query.searchTerm === 'string' ? req.query.searchTerm : undefined;

    if (searchTerm) {
      const videosQuery = searchPostsQuery(searchTerm);

      const videos = await client.fetch(videosQuery);

      res.status(200).json(videos);
    } else {
      res.status(400).json({ error: 'Search term is missing or invalid' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
