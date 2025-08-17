import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Suivi_achat() {
  const navigate = useNavigate();
  const [show, setShow] = useState("facture"); // "facture" ou "commande"
  const [showDocs, setShowDocs] = useState(false);
  const [croissant, setCroissant] = useState(false);

  return (
    <div className="p-6 bg-cyan-500 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 flex justify-between items-center p-6 shadow-lg rounded-lg mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          className="px-4 py-2 rounded-lg border border-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
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

      {/* Navbar centrée */}
      <div className="flex justify-center text-lg font-bold mb-6">
        <button
          onClick={() => navigate("/liste_super_utilisateur")}
          className="border-2 border-gray-800 text-black/80 bg-white py-4 px-10 rounded-l-lg hover:text-cyan-500"
        >
          Utilisateurs
        </button>
        <button
          onClick={() => navigate("/suivit")}
          className="text-black/80 border-2 border-gray-800 text-cyan-600 bg-white py-4 px-10 hover:text-cyan-500"
        >
          Suivi achat
        </button>
        <button
          onClick={() => navigate("/Transaction")}
          className="text-black/80 border-2 border-gray-800 bg-white py-4 px-10 hover:text-cyan-500"
        >
          Transaction
        </button>
        <button
          onClick={() => navigate("/réception")}
          className="text-black/80 border-2 border-gray-800 bg-white py-4 px-10 hover:text-cyan-500 rounded-r-lg"
        >
          Boîte de réception
        </button>
      </div>

      {/* Select */}
      <div className="mb-6 flex justify-center">
        <select
          value={show}
          onChange={(e) => setShow(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        >
          <option value="facture">Facture</option>
          <option value="commande">Commande</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {show === "facture" ? (
          <>
            <h1 className="text-center text-2xl font-bold">LISTE FACTURE</h1>
            <table className="w-full text-left border-collapse table_facture">
              <thead className="bg-cyan-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4 border-b">Référence</th>
                  <th className="py-3 px-4 border-b">Date</th>
                  <th className="py-3 px-4 border-b">Fournisseur</th>
                  <th className="py-3 px-4 border-b">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr
                  className="hover:bg-cyan-50 transition-colors cursor-pointer"
                  onClick={() => setShowDocs(!showDocs)}
                >
                  <td className="py-3 px-4 font-medium">FCT001</td>
                  <td className="py-3 px-4">12/08/2025</td>
                  <td className="py-3 px-4">Fournisseur A</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">
                    Payée
                  </td>
                </tr>
              </tbody>
            </table>
            {croissant ? (
              <button
                className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase border-gray-300 rounded-xl shadow-sm m-3"
                onClick={() => setCroissant(false)}
              >
                Croissante
              </button>
            ) : (
              <button
                className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase border-gray-300 rounded-xl shadow-sm m-3"
                onClick={() => setCroissant(true)}
              >
                Décroissante
              </button>
            )}
          </>
        ) : (
          <>
            <h1 className="text-center text-2xl font-bold">LISTE COMMANDE</h1>
            <table className="w-full text-left border-collapse table_commande">
              <thead className="bg-cyan-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="py-3 px-4 border-b">Référence</th>
                  <th className="py-3 px-4 border-b">Date</th>
                  <th className="py-3 px-4 border-b">Fournisseur</th>
                  <th className="py-3 px-4 border-b">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr
                  className="hover:bg-cyan-50 transition-colors cursor-pointer"
                  onClick={() => setShowDocs(!showDocs)}
                >
                  <td className="py-3 px-4 font-medium">CMD001</td>
                  <td className="py-3 px-4">10/08/2025</td>
                  <td className="py-3 px-4">Fournisseur B</td>
                  <td className="py-3 px-4 text-yellow-600 font-semibold">
                    En attente
                  </td>
                </tr>
              </tbody>
            </table>
            {croissant ? (
              <button
                className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase border-gray-300 rounded-xl shadow-sm m-3"
                onClick={() => setCroissant(false)}
              >
                Croissante
              </button>
            ) : (
              <button
                className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase border-gray-300 rounded-xl shadow-sm m-3"
                onClick={() => setCroissant(true)}
              >
                Décroissante
              </button>
            )}
          </>
        )}
      </div>

      {/* Section DOCUMENTS */}
      {showDocs && (
        <div className="mt-6 bg-cyan-300 p-6 rounded-lg shadow-lg w-[40%]">
          <h3 className="text-white text-2xl font-semibold mb-4">DOCUMENTS</h3>
          <div className="grid grid-cols-3 gap-4">
            <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition">
              Commande
            </button>
            <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition">
              Facture
            </button>
            <button className="bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition">
              Livraison
            </button>
          </div>
        </div>
      )}

      {/* Bouton afficher */}
      <div className="mb-6 flex justify-center ">
        <button className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase border-gray-300 rounded-xl shadow-sm ">
          Afficher
        </button>
      </div>
    </div>
  );
}
