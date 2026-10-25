import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import MaintenancePage from './pages/Maintenance'
import Finances from './pages/Finances'
import Shell from './components/Shell'

export default function App() {
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
