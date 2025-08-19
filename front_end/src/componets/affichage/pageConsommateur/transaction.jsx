import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";



export function Transaction() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [croissant, setCroissant] = useState(false);
  const [factultatif, setfactultatif] = useState(true);
  const [table, setTable] = useState(true);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "compte", headerName: "Compte", width: 150 },
    { field: "fournisseur", headerName: "Fournisseur", width: 150 },
    { field: "montantHT", headerName: "Montant HT", width: 150 },
    { field: "montantTTC", headerName: "Montant TTC", width: 150 },
  ];
  
  const rows = [
    {
      id: 1,
      date: "2025-08-18",
      compte: "BNI",
      fournisseur: "F1",
      montantHT: 200,
      montantTTC: 240,
    },
    {
      id: 2,
      date: "2025-08-18",
      compte: "BOA",
      fournisseur: "F2",
      montantHT: 500,
      montantTTC: 600,
    },
  ];
  return (
    <div>
      <div>
        <div className="bg-blue-600 flex justify-between items-center p-6 shadow-lg ">
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
      </div>
      <div className="p-6 bg-cyan-500 min-h-screen">
        {/* Header */}

        {/* Navbar centrée */}
        <div className="flex justify-center text-lg font-bold mb-6">
          <a
            href=""
            className="border-2 border-gray-800  text-black/80 bg-white py-4 px-10 rounded-l-lg hover:text-cyan-500"
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
            className="text-cyan-600 border-2 border-gray-800 bg-white py-4 px-10 hover:text-cyan-500"
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

        {/* Select */}
        <div className="mb-6 flex justify-center">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            onChange={(e) => {
              if (e.target.value === "table") setTable(true);
              if (e.target.value === "form") setTable(false);
            }}
          >
            <option value="table">Liste Transaction</option>
            <option value="form">Créer Transaction</option>
          </select>
        </div>
        {table ? (
          <div>
            {factultatif ? (
              <div className="mb-6">
                <div className="bg-white  py-1 px-8 rounded-xl shadow-lg w-[30%]">
                  <a
                    href="#"
                    className="underline text-cyan-600 block mb-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setfactultatif(true);
                    }}
                  >
                    Champs facultatif
                  </a>

                  <form className="space-y-2">
                    {/* Date */}
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-gray-700 font-medium">
                        Date :
                      </label>
                      <input
                        type="date"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300"
                      />
                    </div>

                    {/* Fournisseur */}
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-gray-700 font-medium">
                        Fournisseur :
                      </label>
                      <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300">
                        <option>Fournisseur 1</option>
                        <option>Fournisseur 2</option>
                      </select>
                    </div>

                    {/* Complet */}
                    <div className="flex items-center gap-4">
                      <label className="w-32 text-gray-700 font-medium">
                        Compte :
                      </label>
                      <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cyan-300">
                        <option>BNI</option>
                        <option>BOA</option>
                      </select>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-4 pt-2">
                      <button
                        type="button"
                        className="px-6 py-2 font-semibold border bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition"
                        onClick={() => setfactultatif(true)}
                      >
                        Rafraîchir
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 font-semibold border bg-cyan-500 text-white rounded-lg shadow hover:bg-cyan-600 transition"
                      >
                        Rechercher
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="">
                <button
                  className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase border-gray-300 rounded-xl shadow-sm m-3"
                  onClick={() => setfactultatif(true)}
                >
                  Champs de Recherche
                </button>
              </div>
            )}

            <Box sx={{ height: 520, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box>

            {/* Tableau */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-cyan-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="py-3 px-4 border-b">Dates</th>
                    <th className="py-3 px-4 border-b">Comptes</th>
                    <th className="py-3 px-4 border-b">Fournisseur</th>
                    <th className="py-3 px-4 border-b">Ref</th>
                    <th className="py-3 px-4 border-b">Montant HT</th>
                    <th className="py-3 px-4 border-b">Montant TTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr
                    className="hover:bg-cyan-50 transition-colors cursor-pointer"
                    onClick={() => setShow(!show)}
                  >
                    <td className="py-3 px-4 font-medium">LKHIK</td>
                    <td className="py-3 px-4">LNKL</td>
                    <td className="py-3 px-4">/N.LNKJK</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      MJPKJILJ
                    </td>
                    <td className="py-3 px-4">/N.LNKJK</td>
                    <td className="py-3 px-4 text-green-600 font-semibold">
                      MJPKJILJ
                    </td>
                  </tr>
                  <tr className="hover:bg-cyan-50 transition-colors">
                    <td className="py-3 px-4 font-medium"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 text-2xl font-blond px-4">TOTAL </td>
                    <td className="py-3 px-4"> </td>
                    <td className="py-3 px-4 text-yellow-600 font-semibold">
                      600
                    </td>
                    <td className="py-3 px-4 text-yellow-600 font-semibold">
                      600
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
            </div>
            {show && (
              <div className="mt-6 bg-cyan-300 p-6 rounded-lg shadow-lg w-[40%]">
                <h3 className="text-white text-2xl font-semibold mb-4">
                  DOCUMENTS
                </h3>
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

            <div className="mb-6 flex justify-center ">
              <button className="px-8 py-2 font-semibold mt-6 border bg-cyan-100 text-gray-700 uppercase text-smborder-gray-300 rounded-xl shadow-sm ">
                Affiche
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl text-center font-bold underline mb-6 text-gray-800">
              CREATION DE TRANSACTION
            </h1>

            <form className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-lg space-y-5">
              {/* Compte */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-gray-700 font-medium">
                  Compte :
                </label>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="N° de compte"
                />
              </div>

              {/* Fournisseur */}
              <div className="flex items-center gap-4">
                <label className="w-32 text-gray-700 font-medium">
                  Fournisseur :
                </label>
                <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300">
                  <option>Fournisseur 1</option>
                  <option>Fournisseur 2</option>
                </select>
              </div>

              {/* Montants */}
              <div className="grid grid-cols-2 gap-6">
                {/* Montant HT */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    Montant HT :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="0.00"
                    />
                    <span className="absolute left-2 top-2.5 text-gray-500">
                      €
                    </span>
                  </div>
                </div>

                {/* Montant TTC */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-medium mb-1">
                    Montant TTC :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                      placeholder="0.00"
                    />
                    <span className="absolute left-2 top-2.5 text-gray-500">
                      €
                    </span>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                  onClick={() => setTable(true)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section DOCUMENTS affichée si show == true */}
      </div>
    </div>
  );
}
