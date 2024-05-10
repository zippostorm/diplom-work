import type { NextApiRequest, NextApiResponse } from "next";

import { topicPostsQuery } from "../../../utils/queries";
import { client } from "../../../utils/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method === 'GET') {
    const { topic } = req.query;

    if (typeof topic === 'string' || Array.isArray(topic)) {
      const videosQuery = topicPostsQuery(topic);
      const videos = await client.fetch(videosQuery);
      res.status(200).json(videos);
    } else {
      res.status(400).json({ error: 'Invalid topic parameter' });
    }
  }
}

