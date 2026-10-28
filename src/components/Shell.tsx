import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Shell({ children }: { children: ReactNode }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Location El hadja"/><div><strong>Location El hadja</strong><small>Gestion de flotte</small></div></div>
      <nav>
        <NavLink to="/dashboard">Tableau de bord</NavLink>
        <NavLink to="/vehicles">Véhicules</NavLink>
        <NavLink to="/maintenance">Maintenance</NavLink>
        <NavLink to="/finances">Finances</NavLink>
      </nav>
      <button className="btn secondary logout" onClick={() => supabase.auth.signOut()}>Se déconnecter</button>
    </aside>
    <main className="main">{children}</main>
    <nav className="bottom-nav">
      <NavLink to="/dashboard">Accueil</NavLink>
      <NavLink to="/vehicles">Véhicules</NavLink>
      <NavLink to="/maintenance">Entretien</NavLink>
      <NavLink to="/finances">Finances</NavLink>
    </nav>
  </div>
}
