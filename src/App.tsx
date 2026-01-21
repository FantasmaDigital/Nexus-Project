import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/shared/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/inventory/Inventory';
import { IsAuth } from './features/auth/components/IsAuth';
import { ThemeInitializer } from './components/ThemeInitializer';
import { Auth } from './pages/auth/Auth';
import BillingPage from './pages/billing/Billing';

function App() {
  return (
    <BrowserRouter>
      <ThemeInitializer />
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/auth" element={<Auth />} />

        {/* --- Rutas Protegidas --- */}
        {/* IsAuth envuelve todo y Layout provee el marco visual */}
        <Route path="/app" element={<IsAuth><Layout /></IsAuth>}>
          {/* Index Route: Hace que la raíz sea directamente el Dashboard */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Rutas de Módulo: Agrupadas */}
          <Route path="inventory" element={<Inventory />} />
          <Route path="billing" element={<BillingPage />} />
        </Route>

        {/* --- Manejo de 404 / Fallback --- */}
        {/* Si el usuario escribe cualquier cosa, lo mandamos a la raíz */}
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;