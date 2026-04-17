-- base64url encoding requires PG16+. Replace with a PG15-compatible
-- expression that produces the same URL-safe output.
alter table public.army_lists
  alter column share_token
    set default replace(
      replace(
        trim(trailing '=' from encode(gen_random_bytes(12), 'base64')),
        '+', '-'
      ),
      '/', '_'
    );

-- Backfill any rows left with NULL from the broken default
update public.army_lists
set share_token = replace(
  replace(
    trim(trailing '=' from encode(gen_random_bytes(12), 'base64')),
    '+', '-'
  ),
  '/', '_'
)
where share_token is null;
