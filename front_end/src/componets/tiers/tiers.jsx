import * as React from "react";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
/// incons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

//tableau
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export function Tiers() {
  const [loading, setLoading] = useState(false);
  const showMessage = (type, message) => {
    alert(`${type.toUpperCase()} : ${message}`);
  };

  /// TIERS ////////
  const { DonneSession, logout } = useContext(AuthContext);
  const [showTIERS, setShowTERS] = useState(false); // ✅ Ajouté
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ActivationAffichage, setActivationAffichage] = useState("");

  const handleSelect = (section) => {
    setActivationAffichage(section);
  };

  ///insertion
  const [formDataT, setFormDataT] = useState({
    nomTier: "",
    zone: "",
    type: "",
    motDePasse: "",
    email: "",
    contact: "",
    nif: "",
    stat: "",
    rcs: "",
    commercial: "",
    colonne: "",
    colonnes: "",
  });

  const handleChangeT = (e) => {
    const { name, value } = e.target;
    setFormDataT((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit_tier = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://127.0.0.1:8000/api/creationTiers", formDataT, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(true);
      listeT(); // recharge la liste
      handleSelect("ListeTiers");
      showMessage("success", "Inséré avec succès");
      setFormDataT({
        nomTier: "",
        zone: "",
        type: "",
        motDePasse: "",
        email: "",
        contact: "",
        nif: "",
        stat: "",
        rcs: "",
        commercial: "",
        colonne: "",
        colonnes: "",
      });
    } catch (err) {
      console.error("Erreur :", err.response?.data || err.message);
      setError("Erreur de soumission : vérifie les champs.");
    }
  };

  /// LISTE
  const [ListeTiers, setListeTiers] = useState([]);
  const ColunneTIERS = [
    { field: "id", headerName: "N°", width: 40 },
    { field: "nomTier", headerName: "NOM", width: 120 },
    { field: "zone", headerName: "ZONE", width: 80 },
    { field: "type", headerName: "TYPE", width: 80 },
    { field: "email", headerName: "EMAIL", width: 100 },
    { field: "nif", headerName: "NIF", width: 100 },
    { field: "stat", headerName: "STAT", width: 100 },
    { field: "rcs", headerName: "RCS", width: 100 },
    { field: "commercial", headerName: "COMMERCIAL", width: 100 },
    {
      field: "etatBtn",
      headerName: "ACTION ETATS",
      width: 100,
      renderCell: (params) => (
        <button
          onClick={() => etat_Tier(params.row.id, params.row.colonne)}
          className={`${
            params.row.colonne === "activer"
              ? "text-orange-400 hover:text-orange-500"
              : "text-green-500 hover:text-green-600"
          }`}
        >
          {params.row.colonne === "activer" ? (
            <div className="w-[60%]">
              <ToggleOffIcon />
            </div>
          ) : (
            <ToggleOnIcon />
          )}
        </button>
      ),
    },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 90,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setmodife_Tier(params.row); // ⚡ stocke le tier à modifier
              handleSelect("modifTIERS");
            }}
            className="text-green-500 hover:text-green-700"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => TierSuppression(params.row.id)}
            className="text-red-500 hover:text-red-700"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];
  const listeT = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/liste_TIERS");
      setListeTiers(response.data);
      console.log(response.data);
    } catch (err) {
      setErrors("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SUPPRESSION tier
  const TierSuppression = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce tier ?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/supprimer_tier/${id}`);

      // ⚡ Rafraîchir la liste après suppression
      await listeT();
      listeT();
      handleSelect("ListeTiers");
      showMessage("success", "Suppression effectuée avec succès ✅");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression ❌");
    }
  };

  // ✅ CHANGEMENT D’ÉTAT tiers
  const etat_Tier = async (id, currentEtat) => {
    const newStatus = currentEtat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/changer_activation_tier/${id}`,
        { activation: newStatus }
      );

      // Mettre à jour la liste localement sans recharger
      listeT();
      handleSelect("ListeTiers");
      showMessage("success", `Tier ${response.data.activation} avec succès ✅`);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de l'activation ❌");
    }
  };
  ///modification tiers
  const [modife_Tier, setmodife_Tier] = useState(null);
  const ModifeTier = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...modife_Tier };
      const response = await axios.put(
        `http://127.0.0.1:8000/api/modifier_tier/${modife_Tier.id}`,
        payload
      );

      listeT();
      handleSelect("ListeTiers");
      showMessage("success", "Tier modifié avec succès ✅");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du Tier ❌");
    }
  };

  React.useEffect(() => {
    listeT();
  }, []);
  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar fixe */}
      <div className="w-[16rem] h-screen bg-white fixed shadow-lg px-4 py-6 overflow-y-auto">
        <div className="space-y-8">
          {/* Profil */}
          <div id="profile" className="text-center space-y-2">
            <img
              src={
                DonneSession?.profil
                  ? `http://localhost:8000/storage/${DonneSession.profil}`
                  : "/default-avatar.png"
              }
              alt="Profil"
              className="w-20 h-20 object-cover mx-auto rounded-full border-4 border-blue-500 shadow-md"
            />
            <h2 className="text-blue-600 font-semibold text-lg">
              {DonneSession.nom}
            </h2>
            <p className="text-sm text-gray-500">{DonneSession.groupe}</p>
          </div>

          {/* Menu */}
          <div id="menu" className="space-y-2">
            {/* TIERS */}
            <div>
              <h1
                onClick={() => setShowTERS(!showTIERS)}
                className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition"
              >
                TIERS
              </h1>
              {showTIERS && (
                <div className="ml-3 mt-1 space-y-1">
                  <a
                    onClick={() => handleSelect("insertionTiers")}
                    className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                  >
                    CRÉER
                  </a>
                  <a
                    onClick={() => handleSelect("ListeTiers")}
                    className="block cursor-pointer text-gray-600 text-sm py-1 px-2 rounded hover:bg-blue-400 hover:text-white transition"
                  >
                    LISTE
                  </a>
                </div>
              )}
            </div>

            <a className="cursor-pointer text-sm font-semibold text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500 hover:text-white transition">
              Historiques
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[16rem] w-full px-6 py-8">
        {ActivationAffichage === "insertionTiers" && (
          <div>
            <h1 className="text-2xl font-bold text-blue-600 mb-6 underline">
              CRÉER TIERS
            </h1>

            <form
              onSubmit={handleSubmit_tier}
              className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-6"
            >
              {/* Nom */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="nom" className="font-medium text-gray-700">
                  NOM :
                </label>
                <input
                  id="nomTier"
                  type="text"
                  name="nomTier" // correspond exactement au state
                  required
                  value={formDataT.nomTier}
                  onChange={handleChangeT}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="zone" className="font-medium text-gray-700">
                  ZONE :
                </label>
                <input
                  id="zone"
                  type="text"
                  name="zone"
                  required
                  value={formDataT.zone}
                  onChange={handleChangeT}
                  className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="font-medium text-gray-700">
                  EMAIL :
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formDataT.email}
                  onChange={handleChangeT}
                  className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="contact" className="font-medium text-gray-700">
                  CONTACT :
                </label>
                <input
                  id="contact"
                  type="text"
                  name="contact"
                  required
                  value={formDataT.contact}
                  onChange={handleChangeT}
                  className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="nif" className="font-medium text-gray-700">
                  NIF :
                </label>
                <input
                  id="nif"
                  type="text"
                  name="nif"
                  required
                  value={formDataT.nif}
                  onChange={handleChangeT}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="stat" className="font-medium text-gray-700">
                  STAT :
                </label>
                <input
                  id="stat"
                  type="text"
                  name="stat"
                  required
                  value={formDataT.stat}
                  onChange={handleChangeT}
                  className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="rcs" className="font-medium text-gray-700">
                  RCS :
                </label>
                <input
                  id="rcs"
                  type="text"
                  name="rcs"
                  required
                  value={formDataT.rcs}
                  onChange={handleChangeT}
                  className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="commerce" className="font-medium text-gray-700">
                  COMMERCE :
                </label>
                <input
                  id="commercial"
                  type="text"
                  name="commercial" // correspond exactement au state
                  required
                  value={formDataT.commercial}
                  onChange={handleChangeT}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="password" className="font-medium text-gray-700">
                  MOT DE PASSE :
                </label>
                <input
                  type="text"
                  name="motDePasse"
                  value={formDataT.motDePasse}
                  onChange={handleChangeT}
                />
              </div>

              {/* Type */}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="font-medium text-gray-700">
                  TYPE :
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formDataT.type}
                  onChange={handleChangeT}
                  className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">...</option>
                  <option value="Fournisseur">Fournisseur</option>
                  <option value="Client">Client</option>{" "}
                  {/* ici tu avais mis Fournisseur deux fois */}
                  <option value="Livreur">Livreur</option>
                </select>
              </div>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                >
                  VALIDER
                </button>
                {/* <button
                  type="button"
                  onClick={() => setFormDataC({ nom: "", type: "" })}
                  className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                >
                  ANNULER
                </button> */}
              </div>
            </form>
          </div>
        )}

        {ActivationAffichage === "ListeTiers" && (
          <div>
            <h1 className="text-2xl font-bold text-blue-600 mb-6 underline">
              LISTE TIERS
            </h1>

            <Box sx={{ height: "65vh", width: "100%" }}>
              <DataGrid
                rows={ListeTiers}
                columns={ColunneTIERS}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                loading={loading}
              />
            </Box>
          </div>
        )}

        {ActivationAffichage === " " && (
          <div>
            <h1 className="text-2xl font-bold text-blue-600 mb-6 underline">
              LISTE TIERS
            </h1>

            <Box sx={{ height: "65vh", width: "100%" }}>
              <DataGrid
                rows={ListeTiers}
                columns={ColunneTIERS}
                pageSize={5}
                rowsPerPageOptions={[5, 10]}
                loading={loading}
              />
            </Box>
          </div>
        )}

        {ActivationAffichage === "modifTIERS" && modife_Tier && (
          <form
            onSubmit={ModifeTier}
            className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-6"
          >
            {[
              { label: "Nom", name: "nomTier", type: "text" },
              { label: "Zone", name: "zone", type: "text" },
              { label: "Type", name: "type", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Contact", name: "contact", type: "text" },
              { label: "NIF", name: "nif", type: "text" },
              { label: "Stat", name: "stat", type: "text" },
              { label: "RCS", name: "rcs", type: "text" },
              { label: "Commercial", name: "commercial", type: "text" },
              { label: "Mot de passe", name: "motDePasse", type: "text" },
            ].map((field) => (
              <div
                key={field.name}
                className="grid grid-cols-1 md:grid-cols-4 items-center gap-4"
              >
                <label
                  htmlFor={field.name}
                  className="font-medium text-gray-700"
                >
                  {field.label} :
                </label>
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={modife_Tier[field.name] || ""}
                  className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div className="flex justify-end gap-8">
              <div className="">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700  transition"
                >
                  VALIDER
                </button>
                <button
                  onClick={() => {
                    setmodife_Tier(params.row); // ⚡ stocke le tier à modifier
                    handleSelect("modifTIERS");
                  }}
                  className="bg-red-500 text-white px-6 py-2 rounded-md ml-6 hover:bg-blue-700 transition"
                >
                  ANNULER
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
