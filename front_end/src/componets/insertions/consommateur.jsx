import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Consomateur() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    motDePasse: "",
    groupe: "",
    contact: "",
    email: "",
    profil: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cree_super_utilisateurs",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // navigate("/liste_super_utilisateur", {
      //   state: { message: response.data.message },
      // });
      console.log("tonga");
    } catch (err) {
      console.error("Erreur :", err);
      setError("tsy mety");
    }
  };

  return (
    <div>
      <div className="items-center justify-center min-h-screen bg-cyan-500 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white mx-[30%] p-6 rounded-2xl shadow-lg w-full max-w-lg space-y-5"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Insertion Utilisateur
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              name="sexe"
              placeholder="Sexe"
              value={formData.sexe}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="password"
              name="motDePasse"
              placeholder="Mot de passe"
              value={formData.motDePasse}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="text"
              name="email"
              onChange={handleChange}
              value={formData.email}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="file"
              name="profil"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <select
              name="groupe"
              value={formData.groupe}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="">Choisir un Groupe</option>
              <option value="G1">Super Administrateur</option>
              <option value="G2">Utilisateur</option>
            </select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <button
              type="submit"
              className="bg-cyan-500 text-white py-2 px-6 rounded-lg hover:bg-cyan-600 transition"
            >
              Créer
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-gray-400 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
