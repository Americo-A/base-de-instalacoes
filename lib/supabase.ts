import { createClient } from '@supabase/supabase-js'


//console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
//console.log(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!

const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!



export const supabase =
createClient(
url,
key
)