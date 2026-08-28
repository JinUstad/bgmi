const fs = require('fs');
const env = fs.readFileSync('d:/myWork/bgmi/bgmi-admin-pannel/.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim().replace(/^['"]|['"]$/g, '');
  return acc;
}, {});
process.env = { ...process.env, ...env };
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

supabase.from('games').select('slug, name, why_choose_us_features').then(res => console.log(JSON.stringify(res.data, null, 2)));
