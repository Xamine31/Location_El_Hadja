-- OPTIONNEL : exemple pour programmer l'Edge Function avec Supabase Cron.
-- Il faut d'abord activer pg_cron et pg_net puis enregistrer les secrets dans Vault.
-- Remplacez PROJECT_REF et les noms de secrets si nécessaire.

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Dans Supabase Vault, créez :
-- 1) project_url = https://PROJECT_REF.supabase.co
-- 2) cron_secret = la même valeur que le secret CRON_SECRET de l'Edge Function

select cron.schedule(
  'location-el-hadja-maintenance-push',
  '0 7 * * *', -- 07:00 UTC tous les jours (à adapter)
  $$
  select net.http_post(
      url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/maintenance-push',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'cron_secret')
      ),
      body := '{}'::jsonb
  );
  $$
);
