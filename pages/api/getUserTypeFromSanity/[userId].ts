import type { NextApiRequest, NextApiResponse } from 'next';
import { singleUserQuery } from '../../../utils/queries';
import { client } from '../../../utils/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query;

    if (typeof userId === 'string') {
      try {
        const query = singleUserQuery(userId);
        const user = await client.fetch(query);

        if (user.length > 0) {
          res.status(200).json({ userType: user[0].userType });
        } else {
          res.status(200).json({ userType: 'user' });
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    } else {
      res.status(400).json({ error: 'Invalid userId parameter' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
