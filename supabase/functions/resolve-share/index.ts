import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing token' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data, error } = await supabase
    .from('army_lists')
    .select(`
      *,
      faction: factions (*),
      army_entries (
        id,
        quantity,
        unit_type: unit_types (
          *,
          unit_weapons (
            weapon: weapons (
              *,
              weapon_keywords ( keyword: keywords (*), parameter )
            )
          )
        )
      )
    `)
    .eq('share_token', token)
    .eq('is_public', true)
    .single();

  if (error || !data) {
    return new Response(JSON.stringify({ error: 'List not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Flatten unit_weapons → weapons
  const payload = {
    ...data,
    army_entries: data.army_entries.map((e: any) => ({
      id: e.id,
      quantity: e.quantity,
      unit_type: {
        ...e.unit_type,
        weapons: e.unit_type?.unit_weapons?.map((uw: any) => uw.weapon) ?? [],
        unit_weapons: undefined,
      },
    })),
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
