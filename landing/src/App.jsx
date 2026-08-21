import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Buscar from "./pages/Buscar";
import Cuotas from "./pages/Cuotas";
import MainLayout from "./layouts/MainLayout";
import Pendientes from "./pages/Pendientes";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/buscar"
          element={
            <PrivateRoute>
              <MainLayout>
                <Buscar />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cuotas"
          element={
            <PrivateRoute>
              <MainLayout>
                <Cuotas />
              </MainLayout>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/pendientes"
          element={
            <PrivateRoute>
              <MainLayout>
                <Pendientes />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
