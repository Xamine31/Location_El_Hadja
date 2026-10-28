import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import VehicleForm from './pages/VehicleForm'
import MaintenancePage from './pages/Maintenance'
import MaintenanceForm from './pages/MaintenanceForm'
import Finances from './pages/Finances'
import FinanceForm from './pages/FinanceForm'
import Shell from './components/Shell'
export default function App(){const [session,setSession]=useState<Session|null|undefined>(undefined)
 useEffect(()=>{void supabase.auth.getSession().then(({data})=>setSession(data.session));const {data}=supabase.auth.onAuthStateChange((_event,s)=>setSession(s));return ()=>data.subscription.unsubscribe()},[])
 if(!import.meta.env.VITE_SUPABASE_URL||!import.meta.env.VITE_SUPABASE_ANON_KEY)return <main className="main"><h1>Configuration Supabase manquante</h1><p>Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les secrets GitHub Actions puis redéploie.</p></main>
 if(session===undefined)return <div className="splash"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Location El hadja"/><p>Chargement…</p></div>
 if(!session)return <Routes><Route path="*" element={<Login/>}/></Routes>
 return <Shell><Routes><Route path="/dashboard" element={<Dashboard/>}/><Route path="/vehicles" element={<Vehicles/>}/><Route path="/vehicles/new" element={<VehicleForm/>}/><Route path="/vehicles/:id/edit" element={<VehicleForm/>}/><Route path="/maintenance" element={<MaintenancePage/>}/><Route path="/maintenance/new" element={<MaintenanceForm/>}/><Route path="/maintenance/:id/edit" element={<MaintenanceForm/>}/><Route path="/finances" element={<Finances/>}/><Route path="/finances/new" element={<FinanceForm/>}/><Route path="/finances/:kind/:id/edit" element={<FinanceForm/>}/><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes></Shell>
}
