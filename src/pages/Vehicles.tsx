import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {supabase} from '../supabase'
import type {Vehicle} from '../types'
import {money,nicePlate} from '../utils'
export default function Vehicles(){
 const [list,setList]=useState<Vehicle[]>([]);const [error,setError]=useState('')
 async function load(){const {data,error}=await supabase.from('vehicles').select('*').order('created_at',{ascending:false});if(error)setError(error.message);else setList((data||[]) as Vehicle[])}
 useEffect(()=>{void load()},[])
 async function remove(id:string){if(!confirm('Supprimer ce véhicule ET toutes ses maintenances et opérations financières ?'))return;const {error}=await supabase.from('vehicles').delete().eq('id',id);if(error)setError(error.message);else await load()}
 return <><div className="page-head"><div><p className="eyebrow">Parc automobile</p><h1>Véhicules</h1></div><Link className="btn" to="/vehicles/new">+ Nouveau véhicule</Link></div>{error&&<p className="error">{error}</p>}<div className="cards-grid">{list.map(v=><div className="card" key={v.id}><div className="row between"><h3>{v.brand} {v.model}</h3><span className="badge">{({available:'Disponible',rented:'Loué',maintenance:'Entretien',inactive:'Inactif'} as Record<string,string>)[v.status]}</span></div><p className="plate">{nicePlate(v.registration)}</p><p className="muted">{v.year||'—'} · {Number(v.mileage).toLocaleString('fr-FR')} km</p><p className="muted">Achat : {money(v.purchase_price)}</p><div className="row wrap"><Link className="btn secondary" to={`/vehicles/${v.id}/edit`}>Modifier</Link><Link className="btn secondary" to={`/maintenance?vehicle=${v.id}`}>Maintenance</Link><Link className="btn secondary" to={`/finances?vehicle=${v.id}`}>Finances</Link><button className="btn danger" onClick={()=>void remove(v.id)}>Supprimer</button></div></div>)}{list.length===0&&<div className="card">Aucun véhicule enregistré. Clique sur « Nouveau véhicule ».</div>}</div></>
}
