import { FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export function Acceuil() {
  const navigate = useNavigate();
  return (
    <div className="container-fluid mx-auto p-6 bg-cyan-500">
      <h1 className="text-center text-3xl text-gray-700 font-medium mb-4 underline">
        LISTE CATEGORIES
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 rounded-lg">
        <div className="text-center  transition">
          <img
            src="/image/cousine.jfif"
            alt="Cuisine"
            className="w-[70%] h-[70%] object-cover shadow-2xl rounded-lg mx-auto text-center transition-transform duration-300 ease-in-out hover:scale-15 hover:-translate-y-2 hover:shadow-4xl"
          />
          <p className="mt-2 text-gray-700 font-medium">Matériel Cuisine</p>
        </div>

        <div className="text-center">
          <img
            src="/image/phone.jfif"
            alt="Téléphone"
            className="w-[70%] h-[70%] object-cover shadow-2xl rounded-lg mx-auto text-center transition-transform duration-300 ease-in-out hover:scale-15 hover:-translate-y-2 hover:shadow-4xl"
          />
          <p className="mt-2 text-gray-700 font-medium">Téléphones</p>
        </div>

        <div className="text-center">
          <img
            src="/image/lait).jfif"
            alt="Lait"
            // onClick={}
            className="w-[70%] h-[70%] object-cover shadow-2xl rounded-lg mx-auto text-center transition-transform duration-300 ease-in-out hover:scale-15 hover:-translate-y-2 hover:shadow-4xl"
          />
          <p className="mt-2 text-gray-700 font-medium">Produits Laitiers</p>
        </div>
        <div className="text-center">
          <img
            src="/image/fleur.jfif"
            alt="Fleurs"
            className="w-[70%] h-[70%] object-cover shadow-2xl rounded-lg mx-auto text-center transition-transform duration-300 ease-in-out hover:scale-15 hover:-translate-y-2 hover:shadow-4xl"
          />
          <p className="mt-2 text-gray-700 font-medium">Fleurs</p>
        </div>

        <div className="text-center">
          <img
            src="/image/vetement.jfif"
            alt="Vêtements"
            className="w-[70%] h-[70%] object-cover shadow-2xl rounded-lg mx-auto text-center transition-transform duration-300 ease-in-out hover:scale-15 hover:-translate-y-2 hover:shadow-4xl"
          />
          <p className="mt-2 text-gray-700 font-medium">Vêtements</p>
        </div>

        <div className="text-center">
          <img
            src="/image/moto.jfif"
            alt="Moto"
            className="w-[70%] h-[70%] object-cover shadow-2xl rounded-lg mx-auto text-center transition-transform duration-300 ease-in-out hover:scale-15 hover:-translate-y-2 hover:shadow-4xl"
          />
          <p className="mt-2 text-gray-700 font-medium">Motos</p>
        </div>
      </div>

      <h1 className="text-center text-3xl text-gray-700 font-medium mb-4 underline">
        LISTE PRODUIT
      </h1>

      <table className="w-full border border-blue-300 text-left table-auto bg-blue-50 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="py-3 px-4 border border-blue-700">Image</th>
            <th className="py-3 px-4 border border-blue-700">Nom</th>
            <th className="py-3 px-4 border border-blue-700">Description</th>
            <th className="py-3 px-4 border border-blue-700">Zone</th>
            <th className="py-3 px-4 border border-blue-700">Contact</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-blue-100 even:bg-blue-50 hover:bg-blue-200 transition-colors duration-200">
            <td className="py-2 px-4 border border-blue-300">
              <img
                src="/image/telephone.jfif"
                alt="Produit 1"
                className="w-20 h-20 object-cover rounded"
              />
            </td>
            <td className="py-2 px-4 border border-blue-300">Produit 1</td>
            <td className="py-2 px-4 border border-blue-300">Description 1</td>
            <td className="py-2 px-4 border border-blue-300">Zone A</td>
            <td className="py-3 px-4 border border-blue-300 text-center">
              <button
                onClick={() => navigate("/message")}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
              >
                <FiMail className="w-8 h-8 text-blue-600" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6   w-full max-w-sm mx-auto mt-6">
        <a
          className=" text-center flex-1 px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-300"
          href=""
          onClick={() => navigate("/connexion")}
        >
          Connexion
        </a>
        <a
          className=" text-center flex-1 px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-300"
          href=""
          onClick={() => navigate("/cree")}
        >
          Crée
        </a>
      </div>
    </div>
  );
}
