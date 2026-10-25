import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function Dashboard() {
  const [stats,setStats] = useState({vehicles:0,revenue:0,expenses:0,maintenance:0})
  useEffect(()=>{(async()=>{
    const [v,r,e,m]=await Promise.all([
      supabase.from('vehicles').select('*',{count:'exact',head:true}),
      supabase.from('revenues').select('amount'),
      supabase.from('expenses').select('amount'),
      supabase.from('maintenance').select('id').is('completed_at',null)
    ])
    setStats({
      vehicles:v.count||0,
      revenue:(r.data||[]).reduce((s,x)=>s+Number(x.amount),0),
      expenses:(e.data||[]).reduce((s,x)=>s+Number(x.amount),0),
      maintenance:(m.data||[]).length
    })
  })()},[])
  const profit=stats.revenue-stats.expenses
  const money=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n)
  return <>
    <div className="page-head"><div><p className="eyebrow">Location El hadja</p><h1>Tableau de bord</h1></div></div>
    <div className="stats-grid">
      <div className="card stat"><span>Véhicules</span><strong>{stats.vehicles}</strong></div>
      <div className="card stat"><span>Chiffre d’affaires</span><strong>{money(stats.revenue)}</strong></div>
      <div className="card stat"><span>Dépenses</span><strong>{money(stats.expenses)}</strong></div>
      <div className="card stat"><span>Bénéfice</span><strong>{money(profit)}</strong></div>
    </div>
    <div className="card"><h2>Maintenance</h2><p>{stats.maintenance} échéance(s) non terminée(s).</p><p className="muted">Les notifications sont envoyées selon la date ou le kilométrage configuré pour chaque entretien.</p></div>
  </>
}
