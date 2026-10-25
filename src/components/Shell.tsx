import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { resetDemo } from '../demoStore'

export default function Shell({ children }: { children: ReactNode }) {
  function reset(){ if(confirm('Réinitialiser toutes les données de démonstration ?')) { resetDemo(); location.hash = '#/dashboard'; location.reload() } }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Location El hadja"/><div><strong>Location El hadja</strong><small>Gestion de flotte</small></div></div>
      <div className="demo-pill">MODE DÉMO · LOCAL</div>
      <nav>
        <NavLink to="/dashboard">Tableau de bord</NavLink>
        <NavLink to="/vehicles">Véhicules</NavLink>
        <NavLink to="/maintenance">Maintenance</NavLink>
        <NavLink to="/finances">Finances</NavLink>
      </nav>
      <button className="btn secondary logout" onClick={reset}>Réinitialiser la démo</button>
    </aside>
    <main className="main"><div className="demo-banner"><strong>Mode démo</strong> · Les données sont enregistrées uniquement dans ce navigateur.</div>{children}</main>
    <nav className="bottom-nav">
      <NavLink to="/dashboard">Accueil</NavLink>
      <NavLink to="/vehicles">Véhicules</NavLink>
      <NavLink to="/maintenance">Entretien</NavLink>
      <NavLink to="/finances">Finances</NavLink>
    </nav>
  </div>
}
