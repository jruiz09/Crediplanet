// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../components/utils/api"

export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);

  
  const apiLogin = api.urlAPI + "test/user"

  useEffect(() => {
    fetch(apiLogin, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setUser)
      .catch(console.error);
  }, [token]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Mi Perfil</h2>
      {user ? (
        <div className="space-y-2">
          <p><strong>Usuario:</strong> {user.username}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          {/* Más campos si deseas */}
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}
