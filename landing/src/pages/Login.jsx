// src/pages/Login.jsx
import LoginForm from "../components/LoginForm";
import { Wallet } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <Wallet className="h-14 w-14 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-800 mt-2">Bienvenido</h1>
          <p className="text-sm text-gray-500">Iniciá sesión para continuar</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
