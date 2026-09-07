import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for frontend/browser usage
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

// Admin client for server-side APIs
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);