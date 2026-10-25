import { useEffect, useState } from 'react'
import { loadDemo, vehicleFor } from '../demoStore'

export default function Dashboard() {
  const [tick,setTick]=useState(0)
  useEffect(()=>{const fn=()=>setTick(x=>x+1);addEventListener('demo-data-changed',fn);return()=>removeEventListener('demo-data-changed',fn)},[])
  const data=loadDemo(); void tick
  const revenue=data.finances.filter(x=>x.type==='revenue').reduce((s,x)=>s+x.amount,0)
  const expenses=data.finances.filter(x=>x.type==='expense').reduce((s,x)=>s+x.amount,0)
  const pending=data.maintenance.filter(x=>!x.completed_at)
  const profit=revenue-expenses
  const money=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n)
  const today=new Date(); today.setHours(0,0,0,0)
  const urgent=pending.filter(m=>{const v=vehicleFor(data,m.vehicle_id); const dateDue=m.due_date?new Date(m.due_date+'T00:00:00')<=new Date(Date.now()+7*86400000):false; const kmDue=m.due_mileage!=null&&!!v&&v.mileage>=m.due_mileage-500; return dateDue||kmDue})
  return <>
    <div className="hero card"><div><p className="eyebrow">Location El hadja</p><h1>Tableau de bord</h1><p className="muted">Vue rapide de ton parc, de la rentabilité et des entretiens.</p></div><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo"/></div>
    <div className="stats-grid">
      <div className="card stat"><span>Véhicules</span><strong>{data.vehicles.length}</strong><small>{data.vehicles.filter(v=>v.status==='rented').length} actuellement loué(s)</small></div>
      <div className="card stat"><span>Chiffre d’affaires</span><strong>{money(revenue)}</strong><small>Données de démonstration</small></div>
      <div className="card stat"><span>Dépenses</span><strong>{money(expenses)}</strong><small>{data.finances.filter(x=>x.type==='expense').length} opération(s)</small></div>
      <div className="card stat"><span>Bénéfice</span><strong>{money(profit)}</strong><small>Marge {revenue?Math.round(profit/revenue*100):0}%</small></div>
    </div>
    <div className="cards-grid dashboard-grid">
      <div className="card"><div className="row between"><h2>Maintenance</h2><span className="badge">{pending.length} ouverte(s)</span></div><p>{urgent.length ? `${urgent.length} échéance(s) à surveiller rapidement.` : 'Aucune urgence.'}</p>{urgent.slice(0,3).map(m=>{const v=vehicleFor(data,m.vehicle_id);return <div className="mini-row" key={m.id}><div><strong>{m.title}</strong><small>{v?.brand} {v?.model} · {v?.registration}</small></div><span>{m.due_date||`${m.due_mileage?.toLocaleString('fr-FR')} km`}</span></div>})}</div>
      <div className="card"><h2>Parc automobile</h2>{data.vehicles.map(v=><div className="mini-row" key={v.id}><div><strong>{v.brand} {v.model}</strong><small>{v.registration} · {v.mileage.toLocaleString('fr-FR')} km</small></div><span className="badge">{labelStatus(v.status)}</span></div>)}</div>
    </div>
  </>
}
function labelStatus(s:string){return ({available:'Disponible',rented:'Loué',maintenance:'Maintenance',inactive:'Inactif'} as Record<string,string>)[s]||s}
