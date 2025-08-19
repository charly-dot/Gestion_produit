import { useNavigate } from "react-router-dom";

export function Reception() {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 min-h-screen ">
      <div className="bg-blue-600 flex justify-between items-center p-6 shadow-lg rounded-lg mb-6">
        <p></p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            Navigate("/AcceuilConso");
          }}
        >
          <img
            src="/image/telephone.jfif"
            alt="Profil"
            className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-md"
          />
        </a>
      </div>
      <div className=" min-h-screen flex flex-col items-center">
        {/* Navigation */}
        {/* Header */}

        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-center text-lg font-bold mb-6">
            <a
              href=""
              className="border-2 text-black/80 border-gray-800  bg-white py-4 px-10 rounded-l-lg"
              onClick={() => navigate("/liste_super_utilisateur")}
            >
              Utilisateurs
            </a>
            <a
              href=""
              className="text-black/80 border-2 border-gray-800 bg-white py-4 px-10 hover:text-cyan-500"
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
              className=" text-cyan-600 border-2 border-gray-800 bg-white py-4 px-10 hover:text-cyan-500 rounded-r-lg"
              onClick={() => navigate("/réception")}
            >
              Boîte de réception
            </a>
          </div>
        </div>

        {/* Contenu */}
        <div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-cyan-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="w-1/6 px-4 py-3 text-left">Nom</th>
                  <th className="w-1/4 px-4 py-3 text-left">Email</th>
                  <th className="w-7/12 px-4 py-3 text-left">Commentaire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-800">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Jean Dupont</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    jean.dupont@example.com
                  </td>
                  <td className="px-4 py-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    pretium, justo ac cursus luctus, lorem arcu dapibus magna,
                    eu tincidunt arcu metus non justo.
                  </td>
                </tr>

                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">Marie Claire</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    marie.claire@example.com
                  </td>
                  <td className="px-4 py-3">
                    Super service 👌, je recommande vivement cette équipe pour
                    leur professionnalisme !
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
