import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'ujxnm4w4',
  dataset: 'production',
  apiVersion: '2024-04-28',
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOCKEN,
});
