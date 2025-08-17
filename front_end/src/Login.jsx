import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "./../src/api/axios.js";
// import axios from "axios";// ⚠️ bien utiliser ton fichier api.js

export default function Login() {
  const { login } = useContext(AuthContext);
  const [loginInput, setLoginInput] = useState(""); // peut être nom ou email
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", {
        email: loginInput, // envoyé au backend
        password,
      });
      login(res.data.user, res.data.token);
    } catch (err) {
      alert("Erreur login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-500 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Connexion
          </h2>

          <div className="flex flex-col mt-4">
            <label className="mb-1 font-medium text-gray-700">
              Nom ou Email
            </label>
            <input
              type="text"
              placeholder="Nom ou Email"
              value={loginInput}
              onChange={(e) => setLoginInput(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col mt-4">
            <label className="mb-1 font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
            type="submit"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
