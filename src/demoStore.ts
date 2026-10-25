import type { Vehicle, Maintenance } from './types'

export type FinanceRow = {
  id: string
  vehicle_id: string
  amount: number
  date: string
  category: string
  description: string | null
  type: 'revenue' | 'expense'
}

type DemoData = {
  vehicles: Vehicle[]
  maintenance: Maintenance[]
  finances: FinanceRow[]
}

const KEY = 'location-el-hadja-demo-v1'

const now = new Date()
const iso = (d: Date) => d.toISOString().slice(0, 10)
const plusDays = (n: number) => { const d = new Date(now); d.setDate(d.getDate()+n); return iso(d) }

const seed: DemoData = {
  vehicles: [
    {id:'v1',user_id:'demo',registration:'AA-123-AA',brand:'Peugeot',model:'208',year:2023,mileage:42850,purchase_price:18500,purchase_date:'2024-02-12',status:'rented',notes:'Véhicule principal',created_at:new Date().toISOString(),updated_at:new Date().toISOString()},
    {id:'v2',user_id:'demo',registration:'BB-456-BB',brand:'Renault',model:'Clio V',year:2022,mileage:61320,purchase_price:16900,purchase_date:'2023-11-06',status:'available',notes:null,created_at:new Date().toISOString(),updated_at:new Date().toISOString()},
    {id:'v3',user_id:'demo',registration:'CC-789-CC',brand:'Dacia',model:'Sandero',year:2024,mileage:18740,purchase_price:15400,purchase_date:'2025-01-19',status:'maintenance',notes:'Prévoir pneus avant',created_at:new Date().toISOString(),updated_at:new Date().toISOString()},
  ],
  maintenance: [
    {id:'m1',user_id:'demo',vehicle_id:'v1',title:'Vidange moteur',description:'Huile + filtre à huile',due_date:plusDays(6),due_mileage:45000,completed_at:null,cost:120,notify_days_before:7,created_at:new Date().toISOString()},
    {id:'m2',user_id:'demo',vehicle_id:'v3',title:'Pneus avant',description:'Remplacement des deux pneus avant',due_date:plusDays(14),due_mileage:null,completed_at:null,cost:210,notify_days_before:7,created_at:new Date().toISOString()},
    {id:'m3',user_id:'demo',vehicle_id:'v2',title:'Contrôle technique',description:null,due_date:plusDays(45),due_mileage:null,completed_at:null,cost:85,notify_days_before:14,created_at:new Date().toISOString()},
  ],
  finances: [
    {id:'f1',vehicle_id:'v1',amount:1240,date:plusDays(-18),category:'Location',description:'Location 8 jours',type:'revenue'},
    {id:'f2',vehicle_id:'v1',amount:92,date:plusDays(-17),category:'Nettoyage',description:'Préparation véhicule',type:'expense'},
    {id:'f3',vehicle_id:'v2',amount:890,date:plusDays(-12),category:'Location',description:'Location semaine',type:'revenue'},
    {id:'f4',vehicle_id:'v3',amount:210,date:plusDays(-8),category:'Pneus',description:'Acompte pneus',type:'expense'},
    {id:'f5',vehicle_id:'v3',amount:680,date:plusDays(-5),category:'Location',description:'Location courte durée',type:'revenue'},
  ],
}

function clone<T>(x:T):T { return JSON.parse(JSON.stringify(x)) }
export function loadDemo(): DemoData {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) }
  catch {}
  saveDemo(seed)
  return clone(seed)
}
export function saveDemo(data: DemoData) {
  localStorage.setItem(KEY, JSON.stringify(data))
  window.dispatchEvent(new Event('demo-data-changed'))
}
export function resetDemo() { localStorage.removeItem(KEY); saveDemo(seed) }
export function uid(prefix='id') { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7)}` }
export function vehicleFor(data: DemoData, vehicleId: string) { return data.vehicles.find(v=>v.id===vehicleId) }
