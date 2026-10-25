import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com'
const CRON_SECRET = Deno.env.get('CRON_SECRET') || ''

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

function isoDate(d: Date) { return d.toISOString().slice(0,10) }
function daysBetween(a: string, b: string) {
  const one = new Date(`${a}T00:00:00Z`).getTime()
  const two = new Date(`${b}T00:00:00Z`).getTime()
  return Math.round((two-one)/86400000)
}

Deno.serve(async (req) => {
  if (CRON_SECRET && req.headers.get('x-cron-secret') !== CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const today = isoDate(new Date())
  const { data: maintenance, error } = await supabase
    .from('maintenance')
    .select('id,user_id,title,due_date,due_mileage,notify_days_before,vehicles!inner(brand,model,registration,mileage)')
    .is('completed_at', null)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  let sent = 0, skipped = 0, failed = 0
  for (const item of maintenance || []) {
    const vehicle = Array.isArray(item.vehicles) ? item.vehicles[0] : item.vehicles
    const dateDue = item.due_date ? daysBetween(today, item.due_date) <= Number(item.notify_days_before || 0) : false
    const kmDue = item.due_mileage != null ? Number(vehicle?.mileage || 0) >= Number(item.due_mileage) : false
    if (!dateDue && !kmDue) { skipped++; continue }

    const notificationKey = `date:${item.due_date || '-'}|km:${item.due_mileage ?? '-'}`
    const { data: subscriptions } = await supabase.from('push_subscriptions').select('*').eq('user_id', item.user_id)

    for (const sub of subscriptions || []) {
      const { data: already } = await supabase.from('notification_log').select('id').eq('maintenance_id', item.id).eq('subscription_id', sub.id).eq('notification_key', notificationKey).maybeSingle()
      if (already) { skipped++; continue }

      const details:string[] = []
      if (item.due_date) details.push(dateDue && item.due_date < today ? `date dépassée (${item.due_date})` : `échéance ${item.due_date}`)
      if (item.due_mileage != null) details.push(`à ${Number(item.due_mileage).toLocaleString('fr-FR')} km`)
      const payload = JSON.stringify({
        title: `Maintenance · ${vehicle?.registration || 'Véhicule'}`,
        body: `${item.title} — ${vehicle?.brand || ''} ${vehicle?.model || ''} · ${details.join(' · ')}`,
        url: './#/maintenance',
        tag: `maintenance-${item.id}`
      })

      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload)
        await supabase.from('notification_log').insert({ user_id:item.user_id, maintenance_id:item.id, subscription_id:sub.id, notification_key:notificationKey })
        sent++
      } catch (e:any) {
        failed++
        const status = Number(e?.statusCode || 0)
        if (status === 404 || status === 410) await supabase.from('push_subscriptions').delete().eq('id', sub.id)
        console.error('push failed', status, e?.message || e)
      }
    }
  }

  return Response.json({ ok:true, today, sent, skipped, failed })
})
