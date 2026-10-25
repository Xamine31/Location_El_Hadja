import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import MaintenancePage from './pages/Maintenance'
import Finances from './pages/Finances'
import Shell from './components/Shell'

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div className="splash"><img src="./logo.png" alt="Location El hadja"/><p>Chargement…</p></div>

  if (!session) {
    return <Routes><Route path="*" element={<Login/>}/></Routes>
  }

  return (
    <Shell>
      <Routes>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/vehicles" element={<Vehicles/>}/>
        <Route path="/maintenance" element={<MaintenancePage/>}/>
        <Route path="/finances" element={<Finances/>}/>
        <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
      </Routes>
    </Shell>
  )
}
