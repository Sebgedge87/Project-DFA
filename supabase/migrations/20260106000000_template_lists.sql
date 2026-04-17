alter table public.army_lists
  alter column user_id drop not null;

alter table public.army_lists
  add column if not exists is_template boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'army_entries'
      and policyname = 'Public list entries readable'
  ) then
    execute $policy$
      create policy "Public list entries readable"
        on public.army_entries for select
        using (
          army_list_id in (select id from public.army_lists where is_public = true)
        )
    $policy$;
  end if;
end$$;
