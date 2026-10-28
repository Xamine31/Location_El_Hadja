-- Exécuter APRÈS 001_initial.sql dans Supabase SQL Editor.
-- Les maintenances terminées sont supprimées 7 jours après completed_at.
-- Note: leurs journaux de notification sont supprimés en cascade.
create extension if not exists pg_cron;
create index if not exists maintenance_completed_idx on public.maintenance(completed_at) where completed_at is not null;
create or replace function public.purge_completed_maintenance()
returns integer language plpgsql security definer set search_path=public as $$
declare deleted_count integer;
begin
  delete from public.maintenance where completed_at is not null and completed_at < now() - interval '7 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
revoke all on function public.purge_completed_maintenance() from public, anon, authenticated;
-- Supprime puis réinstalle le job afin de permettre une réexécution du SQL.
do $$ begin
 if exists(select 1 from cron.job where jobname='elhadja-purge-maintenance') then
  perform cron.unschedule('elhadja-purge-maintenance');
 end if;
end $$;
select cron.schedule('elhadja-purge-maintenance','15 2 * * *', $$ select public.purge_completed_maintenance(); $$);
