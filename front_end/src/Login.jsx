import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", {
        email,
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
            Inscription
          </h2>
          <div className="flex flex-col">
            <label
              htmlFor="fullName"
              className="mb-1 font-medium text-gray-700"
            >
              Nom complet
            </label>
            <input
              type="text"
              placeholder="Nom"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="fullName"
              className="mb-1 font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-medium"
            type="submit"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
