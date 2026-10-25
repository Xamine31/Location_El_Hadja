import { FormEvent, useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [mode, setMode] = useState<'login'|'signup'>('login')

  async function submit(e: FormEvent) {
    e.preventDefault(); setMsg('')
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (result.error) setMsg(result.error.message)
    else if (mode === 'signup') setMsg('Compte créé. Vérifie ton email si la confirmation est activée dans Supabase.')
  }

  return <div className="login-page">
    <div className="login-card card">
      <img className="login-logo" src="./logo.png" alt="Location El hadja"/>
      <h1>{mode === 'login' ? 'Connexion' : 'Créer un compte'}</h1>
      <form onSubmit={submit} className="stack">
        <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label>Mot de passe<input type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} /></label>
        <button className="btn" type="submit">{mode === 'login' ? 'Se connecter' : 'Créer le compte'}</button>
      </form>
      {msg && <p className="notice">{msg}</p>}
      <button className="link-btn" onClick={()=>setMode(mode==='login'?'signup':'login')}>
        {mode === 'login' ? 'Créer un compte' : 'J’ai déjà un compte'}
      </button>
    </div>
  </div>
}
