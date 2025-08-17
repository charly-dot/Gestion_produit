import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../../AuthContext";
import { useContext } from "react";

export function IndexConsommateur() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/"); // redirection après déconnexion
  };

  // Si user n'est pas encore chargé, on peut afficher un loader ou rien
  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="p-6">
        <div className="bg-blue-600 flex justify-between items-center p-6 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="px-4 py-2 rounded border border-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Déconnexion
          </button>
          <a href="" onClick={() => navigate("/AcceuilConso")}>
            <img
              src={user.profi}
              alt="Profil"
              className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-md"
            />

            {/* test */}

            {/* {user.nom} */}

            {/* test */}
          </a>
        </div>

        {/* Navbar */}

        {/* Contenu */}
        <div className="max-w-6xl mx-auto mt-10 px-6">
          <h1 className="text-center text-3xl font-bold text-blue-800 mb-6">
            LISTE DES PRODUITS
          </h1>

          <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="w-full border-collapse">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="py-3 px-4 border border-blue-700">Image</th>
                  <th className="py-3 px-4 border border-blue-700">Nom</th>
                  <th className="py-3 px-4 border border-blue-700">
                    Description
                  </th>
                  <th className="py-3 px-4 border border-blue-700">Zone</th>
                  <th className="py-3 px-4 border border-blue-700">Contact</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-100 transition-colors duration-200">
                  <td className="py-3 px-4 border border-blue-300">
                    <img
                      src="/image/telephone.jfif"
                      alt="Produit 1"
                      className="w-20 h-20 object-cover rounded shadow-sm"
                    />
                  </td>
                  <td className="py-3 px-4 border border-blue-300 font-medium text-blue-900">
                    Produit 1
                  </td>
                  <td className="py-3 px-4 border border-blue-300 text-gray-700">
                    Description 1
                  </td>
                  <td className="py-3 px-4 border border-blue-300 text-gray-700">
                    Zone A
                  </td>
                  <td className="py-3 px-4 border border-blue-300 text-center">
                    <button
                      onClick={() => navigate("/message")}
                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                    >
                      <FiMail className="w-6 h-6 text-blue-600" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
