import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../../AuthContext";
import { useContext } from "react";

export function IndexConsommateur() {
  const navigate = useNavigate();
  const { DonneSession, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const produits = [
    {
      id: 1,
      image: "/image/telephone.jfif",
      nom: "Téléphone Samsung",
      description: "Smartphone dernière génération",
      zone: "Antananarivo",
    },
    {
      id: 2,
      image: "/image/lait).jfif",
      nom: "Lait Gloria",
      description: "Boîte de lait concentré sucré",
      zone: "Toamasina",
    },
    {
      id: 3,
      image: "/image/fleur.jfif",
      nom: "Bouquet de Roses",
      description: "Roses rouges fraîches",
      zone: "Fianarantsoa",
    },
    {
      id: 4,
      image: "/image/moto.jfif",
      nom: "Moto Yamaha",
      description: "Moto 125cc en bon état",
      zone: "Mahajanga",
    },
    {
      id: 5,
      image: "/image/vetement.jfif",
      nom: "Chemise Homme",
      description: "Chemise coton slim fit",
      zone: "Antsirabe",
    },
    {
      id: 6,
      image: "/image/cousine.jfif",
      nom: "Mixeur Moulinex",
      description: "Mixeur 3 vitesses, 500W",
      zone: "Tamatave",
    },
    {
      id: 7,
      image: "/image/telephone.jfif",
      nom: "iPhone 13",
      description: "128Go, état neuf",
      zone: "Antananarivo",
    },
    {
      id: 8,
      image: "/image/lait).jfif",
      nom: "Fromage Président",
      description: "Pack de 12 portions",
      zone: "Diego Suarez",
    },
    {
      id: 9,
      image: "/image/fleur.jfif",
      nom: "Orchidée Blanche",
      description: "Plante vivante en pot",
      zone: "Antsirabe",
    },
    {
      id: 10,
      image: "/image/moto.jfif",
      nom: "Scooter Honda",
      description: "Scooter 50cc, faible consommation",
      zone: "Mahajanga",
    },
    {
      id: 11,
      image: "/image/vetement.jfif",
      nom: "Robe de soirée",
      description: "Robe élégante pour femmes",
      zone: "Antananarivo",
    },
    {
      id: 12,
      image: "/image/cousine.jfif",
      nom: "Four Micro-ondes",
      description: "20L, fonction grill",
      zone: "Tamatave",
    },
    {
      id: 13,
      image: "/image/telephone.jfif",
      nom: "Téléphone Oppo",
      description: "Caméra 48MP, 64Go",
      zone: "Antsirabe",
    },
    {
      id: 14,
      image: "/image/lait).jfif",
      nom: "Yaourt Nature",
      description: "Lot de 6 yaourts frais",
      zone: "Toliara",
    },
    {
      id: 15,
      image: "/image/fleur.jfif",
      nom: "Tulipes Jaunes",
      description: "Bouquet de 15 tiges",
      zone: "Fianarantsoa",
    },
    {
      id: 16,
      image: "/image/moto.jfif",
      nom: "Kawasaki Ninja",
      description: "600cc, sportif",
      zone: "Antananarivo",
    },
    {
      id: 17,
      image: "/image/vetement.jfif",
      nom: "Pantalon Jeans",
      description: "Jeans bleu slim",
      zone: "Mahajanga",
    },
    {
      id: 18,
      image: "/image/cousine.jfif",
      nom: "Casserole inox",
      description: "Casserole 24cm",
      zone: "Diego Suarez",
    },
    {
      id: 19,
      image: "/image/telephone.jfif",
      nom: "Huawei P40",
      description: "64Go, double SIM",
      zone: "Antananarivo",
    },
    {
      id: 20,
      image: "/image/lait).jfif",
      nom: "Beurre Président",
      description: "250g doux",
      zone: "Toamasina",
    },
    {
      id: 21,
      image: "/image/fleur.jfif",
      nom: "Marguerites",
      description: "Bouquet champêtre",
      zone: "Tamatave",
    },
    {
      id: 22,
      image: "/image/moto.jfif",
      nom: "Moto Suzuki",
      description: "250cc, parfait état",
      zone: "Antsirabe",
    },
  ];

  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
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
              src={`http://localhost:8000/storage/${DonneSession.profil}`}
              alt="Profil"
              className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-md"
            />
          </a>
        </div>

        <div className="max-w-6xl mx-auto mt-10 px-6">
          <h1 className="text-center text-3xl font-bold text-blue-800 mb-6">
            LISTE DES PRODUITS
          </h1>

          <div className="w-full overflow-x-auto">
        <div className="max-h-[90vh] overflow-y-auto border border-blue-300 rounded-lg shadow-md">
          <table className="min-w-full border border-blue-300 text-left table-auto bg-blue-50 rounded-lg shadow-md">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="py-3 px-4 border border-blue-700 sticky top-0 bg-blue-800 z-20">
                  Image
                </th>
                <th className="py-3 px-4 border border-blue-700 sticky top-0 bg-blue-800 z-20">
                  Nom
                </th>
                <th className="py-3 px-4 border border-blue-700 sticky top-0 bg-blue-800 z-20">
                  Description
                </th>
                <th className="py-3 px-4 border border-blue-700 sticky top-0 bg-blue-800 z-20">
                  Zone
                </th>
                <th className="py-3 px-4 border border-blue-700 sticky top-0 bg-blue-800 z-20">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {produits.map((produit) => (
                <tr
                  key={produit.id}
                  className="bg-blue-100 even:bg-blue-50 hover:bg-blue-200 transition-colors duration-200"
                >
                  <td className="py-2 px-4 border border-blue-300">
                    <img
                      src={produit.image}
                      alt={produit.nom}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border border-blue-300">
                    {produit.nom}
                  </td>
                  <td className="py-2 px-4 border border-blue-300">
                    {produit.description}
                  </td>
                  <td className="py-2 px-4 border border-blue-300">
                    {produit.zone}
                  </td>
                  <td className="py-3 px-4 border border-blue-300 text-center">
                    <button
                      onClick={() => navigate("/message")}
                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                    >
                      <FiMail className="w-8 h-8 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
