// /api/supabase-proxy.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Use your Supabase project URL and Service Role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { email, password } = req.body;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
  });

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ user: data });
}
