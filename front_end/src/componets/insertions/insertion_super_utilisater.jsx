import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function SuperUtilisateur() {
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
      await axios.post(
        "http://127.0.0.1:8000/api/cree_super_utilisateurs",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("tonga");
    } catch (err) {
      console.error("Erreur :", err);
      setError("tsy mety");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex flex-col items-center py-8">
      {/* Navbar centrée */}
      <div className="bg-blue-600 flex justify-between items-center p-6 shadow-lg rounded-lg mb-6 w-[95%]">
        <p></p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/AcceuilConso");
          }}
        >
          <img
            src="/image/telephone.jfif"
            alt="Profil"
            className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-md"
          />
        </a>
      </div>
      <div className="flex justify-between items-center mb-4 ">
        <div className="flex justify-center text-lg font-bold mb-6">
          <a
            href=""
            className="border-2 border-gray-800  text-cyan-600 bg-white py-4 px-10 rounded-l-lg"
            onClick={() => navigate("/liste_super_utilisateur")}
          >
            Utilisateurs
          </a>
          <a
            href=""
            className="text-black/80 border-2  border-gray-800 bg-white py-4 px-10 hover:text-cyan-500"
            onClick={() => navigate("/suivit")}
          >
            Suivi achat
          </a>
          <a
            href=""
            className="text-black/80 border-2 border-gray-800 bg-white py-4 px-10 hover:text-cyan-500"
            onClick={() => navigate("/Transaction")}
          >
            Transaction
          </a>
          <a
            href=""
            className="text-black/80 border-2 border-gray-800 bg-white py-4 px-10 hover:text-cyan-500 rounded-r-lg"
            onClick={() => navigate("/réception")}
          >
            Boîte de réception
          </a>
        </div>
      </div>
      <select
        className=" px-8 py-2  ml-[85%] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        onChange={(e) => {
          const value = e.target.value;
          if (value) window.location.href = value; // redirection
        }}
      >
        <option value="/liste_super_utilisateur">Liste</option>
        <option value="/cree_super_utilisateur">Créer</option>
        <option value="/groupe_utilisateur">Groupe</option>
      </select>
      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg space-y-5"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            name="sexe"
            placeholder="Sexe"
            value={formData.sexe}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            name="motDePasse"
            placeholder="Mot de passe"
            value={formData.motDePasse}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="file"
            name="profil"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
          />
          <select
            name="groupe"
            value={formData.groupe}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400"
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
            onClick={() => navigate("/liste_super_utilisateur")}
            className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-gray-400 transition"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
