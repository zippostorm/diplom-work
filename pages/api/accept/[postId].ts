import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../utils/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const { postId } = req.query;

      if (!postId || typeof postId !== 'string') {
        return res.status(400).json({ error: 'Invalid postId' });
      }

      const data = await client
        .patch(postId)
        .set({ status: 'accepted' })
        .commit();

      res.status(200).json({ message: 'Post accepted successfully', data });
    } catch (error) {
      console.error('Error accepting post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    const { postId } = req.query;
    try {
      const postIdString = Array.isArray(postId) ? postId[0] : postId;
      if (!postIdString) {
        return res.status(400).json({ error: 'postId is required' });
      }
      await client.delete(postIdString);
      res.status(200).end();
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
