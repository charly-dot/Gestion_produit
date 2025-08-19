import { useEffect, useState, useContext } from "react";
import api from "../../../api/axios.js";
import { AuthContext } from "./../../../AuthContext";
import { useNavigate } from "react-router-dom";

export function AcceuilConsommater() {
  const navigate = useNavigate();
  const { DonneSession, logout } = useContext(AuthContext);

  // ✅ Tous les hooks déclarés en haut
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = DonneSession?.id;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/liste_utilisateur/${userId}`);
      setUser(response.data);
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleActivationToggle = async () => {
    if (!user) return;
    const newStatus = user.activation === "activer" ? "desactiver" : "activer";
    try {
      const response = await api.patch(`/changer_activation/${user.id}`, {
        activation: newStatus,
      });
      setUser({ ...user, activation: response.data.activation });
      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch {
      setError("Erreur lors de la modification de l'activation.");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?"))
      return;

    try {
      const response = await api.delete(
        `/supprimer_super_utilisateur/${user.id}`
      );
      setUser(null);
      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleEdit = () => setEditUser(user);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editUser) return;

    try {
      const data = new FormData();
      for (let key in editUser) {
        data.append(key, editUser[key]);
      }

      const response = await api.post(
        `/modifier_utilisateur/${editUser.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(response.data);
      setSuccessMessage("Utilisateur modifié avec succès");
      setEditUser(null);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch {
      setError("Erreur lors de la modification.");
    }
  };

  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }

  return (
    <div>
      <div className="bg-white flex justify-between items-center  shadow-lg">
        <button
          onClick={handleLogout}
          className="px-3 py-1  ml-[7%] bg-red-500 text-white rounded"
        >
          Déconnexion
        </button>

        <a
          href=""
          onClick={() => navigate("/AcceuilConso")}
          className="mr-[8%] p-1"
        >
          <img
            src={`http://localhost:8000/storage/${DonneSession.profil}`}
            alt="Profil"
            className="w-16  h-16 object-cover rounded-full border-4 border-cyan-500 shadow-md"
          />
        </a>
      </div>
      <div className=" bg-cyan-500 min-h-screen flex flex-col items-center">
        {/* Header */}

        {/* Navigation */}
        <div className="flex justify-center text-lg font-bold mb-6 gap-6">
          <a
            href=""
            className="border border-cyan-500 border-b-cyan-100 text-white py-4 px-10"
            onClick={() => navigate("/liste_super_utilisateur")}
          >
            Utilisateurs
          </a>
          <a
            href=""
            className="text-black/80 text-white py-4 px-10   hover:border  hover:border-cyan-500  hover:border-b-cyan-100"
            onClick={() => navigate("/suivit")}
          >
            Suivi achat
          </a>
          <a
            href=""
            className="text-black/80 text-white py-4 px-10   hover:border  hover:border-cyan-500  hover:border-b-cyan-100"
            onClick={() => navigate("/Transaction")}
          >
            Transaction
          </a>
          <a
            href=""
            className="text-black/80 text-white py-4 px-10   hover:border  hover:border-cyan-500  hover:border-b-cyan-100"
            onClick={() => navigate("/réception")}
          >
            Boîte de réception
          </a>
        </div>

        {/* Select rapide */}
        <select
          className="px-8 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onChange={(e) => {
            const value = e.target.value;
            if (value) window.location.href = value;
          }}
        >
          <option value="/liste_super_utilisateur">Liste</option>
          <option value="/cree_super_utilisateur">Créer</option>
          <option value="/groupe_utilisateur">Groupe</option>
        </select>

        {/* Messages */}
        {successMessage && (
          <p className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4 shadow-md">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 shadow-md">
            {error}
          </p>
        )}

        {/* Corps principal */}
        {loading ? (
          <p className="text-white text-lg font-semibold">Chargement...</p>
        ) : user ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md text-center transform transition duration-300 hover:scale-[1.02]">
            <div className="flex justify-center">
              <img
                src={
                  user.profil
                    ? `http://127.0.0.1:8000/storage/${user.profil}`
                    : "https://via.placeholder.com/100"
                }
                alt={user.nom}
                className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md"
              />
            </div>

            <div className="bg-white p-6 rounded-xl max-w-lg mx-auto mt-4 text-left space-y-2 text-gray-700">
              <p>
                <strong>Nom:</strong> {user.nom}
              </p>
              <p>
                <strong>Prénom:</strong> {user.prenom}
              </p>
              <p>
                <strong>Sexe:</strong> {user.sexe}
              </p>
              <p>
                <strong>Rôle:</strong> {user.role}
              </p>
              <p>
                <strong>Contact:</strong> {user.contact || "-"}
              </p>
              <p>
                <strong>Activation:</strong> {user.activation}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={handleActivationToggle}
                className={`px-5 py-2 rounded-lg text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105 ${
                  user.activation === "activer"
                    ? "bg-orange-400 hover:bg-orange-500"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {user.activation === "activer" ? "Désactiver" : "Activer"}
              </button>

              <button
                onClick={handleEdit}
                className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
              >
                Modifier
              </button>

              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
              >
                Supprimer
              </button>
            </div>
          </div>
        ) : (
          <p className="text-white font-semibold mt-10">
            Aucun utilisateur trouvé.
          </p>
        )}

        {/* Modal de modification */}
        {editUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
              onSubmit={handleEditSubmit}
              className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-4 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-center text-cyan-600">
                Modifier utilisateur
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={editUser.nom}
                  onChange={(e) =>
                    setEditUser({ ...editUser, nom: e.target.value })
                  }
                  placeholder="Nom"
                  className="input"
                />
                <input
                  type="text"
                  value={editUser.prenom}
                  onChange={(e) =>
                    setEditUser({ ...editUser, prenom: e.target.value })
                  }
                  placeholder="Prénom"
                  className="input"
                />
                <input
                  type="text"
                  value={editUser.sexe}
                  onChange={(e) =>
                    setEditUser({ ...editUser, sexe: e.target.value })
                  }
                  placeholder="Sexe"
                  className="input"
                />
                <input
                  type="text"
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  placeholder="Rôle"
                  className="input"
                />
                <input
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  placeholder="Email"
                  className="input"
                />
                <input
                  type="text"
                  value={editUser.contact || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, contact: e.target.value })
                  }
                  placeholder="Contact"
                  className="input"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
