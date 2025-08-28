import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useContext, useState } from "react";
import { AuthContext } from "../../AuthContext";
import axios from "axios";
/// incons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

//tableau
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

// COLONNE DOCUMENTS
const colonne_Documents = [
  { field: "id", headerName: "N°", width: 70 },
  { field: "nomTier", headerName: "NOM", width: 220 },
  { field: "zone", headerName: "ZONE", width: 220 },
  { field: "type", headerName: "TYPE", width: 220 },
  { field: "valeur", headerName: "VALEUR", width: 180 },
];
const row_documents = [
  {
    id: 1,
    nomTier: "Société A",
    zone: "Antananarivo",
    type: "Client",
    valeur: 10,
  },
  {
    id: 2,
    nomTier: "Entreprise B",
    zone: "Toamasina",
    type: "Fournisseur",
    valeur: 25,
  },
  {
    id: 3,
    nomTier: "Magasin C",
    zone: "Fianarantsoa",
    type: "Partenaire",
    valeur: 15,
  },
  {
    id: 4,
    nomTier: "Client D",
    zone: "Antsirabe",
    type: "Client",
    valeur: 30,
  },
  {
    id: 5,
    nomTier: "Agence E",
    zone: "Mahajanga",
    type: "Fournisseur",
    valeur: 12,
  },
  {
    id: 6,
    nomTier: "Distributeur F",
    zone: "Toliara",
    type: "Partenaire",
    valeur: 18,
  },
  {
    id: 7,
    nomTier: "Client G",
    zone: "Diego-Suarez",
    type: "Client",
    valeur: 22,
  },
  {
    id: 8,
    nomTier: "Entreprise H",
    zone: "Antananarivo",
    type: "Fournisseur",
    valeur: 40,
  },
  {
    id: 9,
    nomTier: "Société I",
    zone: "Antsirabe",
    type: "Partenaire",
    valeur: 35,
  },
  {
    id: 10,
    nomTier: "Client J",
    zone: "Toamasina",
    type: "Client",
    valeur: 28,
  },
];

export function Tiers() {
  const [navbar, setNavbar] = useState("");
  const [loading, setLoading] = useState(false);
  const showMessage = (type, message) => {
    alert(`${type.toUpperCase()} : ${message}`);
  };

  /// TIERS ////////
  const { DonneSession, logout } = useContext(AuthContext);
  const [showTIERS, setShowTERS] = useState(false); // ✅ Ajouté
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // navbar
  const [condition_navbar, setcondition_navbar] = useState(" ");
  const [ActivationAffichage, setActivationAffichage] = useState(" ");
  const handleSelect = (section, navbar) => {
    setActivationAffichage(section);
    setcondition_navbar(navbar);
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
    { field: "type", headerName: "TYPE", width: 150 },
    { field: "nomTier", headerName: "NOM", width: 220 },
    { field: "zone", headerName: "ZONE", width: 220 },
    { field: "colonne", headerName: "ETAT", width: 210 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 220,
      renderCell: (params) => (
        <div className="flex gap-2">
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
            onClick={() => {
              setDonne_Tier(params.row);
              handleSelect("detailTier");
            }}
            className="text-blue-300 hover:text-blue-400"
          >
            <VisibilityIcon />
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
      setOriginalListeTIERS(response.data);
      setrow_livreur(response.data);
      setListeTiers(response.data);
      setcondition_navbar("tier");
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
      setcondition_navbar("tier");
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

      listeT();
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
      setcondition_navbar("tier");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification du Tier ❌");
    }
  };

  // rechrerche TIERS
  const [OriginalListeTIERS, setOriginalListeTIERS] = useState([]);
  const [formDataSearcheTIERS, setformDataSearcheTIERS] = useState({
    nomTier: "",
    type: "",
    zone: "",
  });
  const handleChangeSearcheTIERS = (e) => {
    const { name, value } = e.target;
    setformDataSearcheTIERS((prev) => ({ ...prev, [name]: value }));
  };
  const handleSearcheSubmitTIERS = (e) => {
    e.preventDefault();
    const filtered = OriginalListeTIERS.filter((item) => {
      return (
        (formDataSearcheTIERS.nomTier === "" ||
          item.nomTier === formDataSearcheTIERS.nomTier) &&
        (formDataSearcheTIERS.type === "" ||
          item.type === formDataSearcheTIERS.type) &&
        (formDataSearcheTIERS.zone === "" ||
          item.zone === formDataSearcheTIERS.zone)
      );
    });
    setListeTiers(filtered); // ✅ corrigé
    setcondition_navbar("tier");
  };
  const handleRefreshTIERS = () => {
    setformDataSearcheTIERS({ nomTier: "", type: "", zone: "" });
    setListeTiers(OriginalListeTIERS); // ✅ corrigé
    setcondition_navbar("tier");
  };

  ///DETAIL TIER
  const [Donne_Tier, setDonne_Tier] = useState(null);

  // REMISE
  const [pourcetang, setpourcetang] = useState("pourcentage");
  const hadleChoisitRemise = () => {};

  // DOCUMENTS
  const [NavbarDocuments, setNavbarDocuments] = useState("TSS");

  // livreur
  const [row_livreur, setrow_livreur] = useState([]);
  const colonne_livreur = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "nomTier", headerName: "NOM", width: 170 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "motDePasse", headerName: "MOT DE PASSE", width: 150 },
    { field: "contact", headerName: "CONTACT", width: 120 },
    { field: "zone", headerName: "ZONE", width: 100 },
    {
      field: "action",
      headerName: "ACTIONS",
      width: 110,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              handleSelect("LIVREUR", "LIVREUR");
              etat_Tier(params.row.id, params.row.colonne);
              handleSelect("LIVREUR", "LIVREUR");
            }}
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
          <button
            onClick={() => {
              setmodife_Tier(params.row); // ⚡ stocke le tier à modifier
              handleSelect("modifService");
            }}
            className="text-green-500 hover:text-green-700"
          >
            <EditIcon />
          </button>
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    listeT();
    setActivationAffichage(" ");
  }, []);
  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }

  return (
    <div className="container-fluid mx-auto h-screen bg-gray-200 flex flex-col  h-[130%]">
      {/* Sidebar fixe */}
      <div className="flex flex-grow h-0">
        <div className="w-[240px] bg-white shadow-xl px-3 overflow-y-auto">
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
                      onClick={() => {
                        handleSelect("ListeTiers");
                        setNavbarDocuments("ListeTiers");
                      }}
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
        <div className="p-6 w-[160vh]">
          {/* remise */}

          {NavbarDocuments === "documents" ? (
            <div className="flex justify-center text-lg font-bold mb-2">
              <button
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      ${condition_navbar === "LIVREUR" ? " border-b-blue-500 " : ""}`}
                onClick={() => handleSelect("LIVREUR", "LIVREUR")}
              >
                LIVREUR
              </button>

              <button
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      ${condition_navbar === "DOCUMENTS" ? " border-b-blue-500 " : ""}`}
                onClick={() => {
                  handleSelect("DOCUMENTS", "DOCUMENTS");
                  setNavbarDocuments("documents");
                }}
              >
                DOCUMENTS
              </button>

              <button
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      ${condition_navbar === "NOTES" ? " border-b-blue-500 " : ""}`}
                onClick={() => handleSelect("NOTES", "NOTES")}
              >
                NOTES
              </button>
            </div>
          ) : (
            <div className="flex justify-center text-lg font-bold mb-2">
              <button
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      ${condition_navbar === "ListeTiers" ? " border-b-blue-500 " : ""}`}
                onClick={() => handleSelect("ListeTiers", " ")}
              >
                TIERS
              </button>

              <button
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      ${condition_navbar === "REMISE" ? " border-b-blue-500 " : ""}`}
                onClick={() => handleSelect("InsertionRemise", "REMISE")}
              >
                REMISE
              </button>

              <button
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      ${condition_navbar === "DOCUMENTS" ? " border-b-blue-500 " : ""}`}
                onClick={() => {
                  handleSelect("DOCUMENTS", "DOCUMENTS");
                  setNavbarDocuments("documents");
                }}
              >
                DOCUMENTS
              </button>

              <button
                className={`hover:border-b-blue-500 border border-gray-200 text-blue-500 py-1 px-10
      ${condition_navbar === "HISTORIQUE" ? " border-b-blue-500 " : ""}`}
                onClick={() => handleSelect("HISTORIQUE", "HISTORIQUE")}
              >
                HISTORIQUE
              </button>
            </div>
          )}

          {ActivationAffichage === "NOTES" && (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-blue-600 mb-8 text-center">
                NOTES
              </h1>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* QUALIFICATION + */}
                <div className="flex flex-col">
                  <label
                    htmlFor="QUALIFICATION"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    QUALIFICATION +
                  </label>
                  <input
                    name="QUALIFICATION"
                    type="number"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* QUALIFICATION - */}
                <div className="flex flex-col">
                  <label
                    htmlFor="QUALIFICATION_"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    QUALIFICATION -
                  </label>
                  <input
                    name="QUALIFICATION_"
                    type="number"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* MENSUEL */}
                <div className="flex flex-col">
                  <label
                    htmlFor="MENSUEL"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    MENSUEL
                  </label>
                  <input
                    name="MENSUEL"
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                {/* ANNUEL */}
                <div className="flex flex-col">
                  <label
                    htmlFor="ANNUEL"
                    className="mb-2 font-semibold text-gray-700"
                  >
                    ANNUEL
                  </label>
                  <input
                    name="ANNUEL"
                    type="text"
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </form>

              {/* Bouton en dessous */}
              <div className="mt-8 flex justify-end gap-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                >
                  VALIDER
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                >
                  REFRECHIR
                </button>
              </div>
            </div>
          )}

          {ActivationAffichage === "modifService" && (
            <form
              onSubmit={ModifeTier}
              className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Nom", name: "nomTier", type: "text" },
                  { label: "Zone", name: "zone", type: "text" },
                  { label: "Type", name: "type", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Contact", name: "contact", type: "text" },
                  { label: "Mot de passe", name: "motDePasse", type: "text" },
                ].map((field) => (
                  <div key={field.name} className="flex items-center gap-4">
                    <label className="w-32 font-medium">{field.label} :</label>
                    <input
                      type={field.type}
                      value={modife_Tier[field.name]}
                      onChange={(e) =>
                        setmodife_Tier({
                          ...modife_Tier,
                          [field.name]: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  VALIDER
                </button>
              </div>
            </form>
          )}

          {ActivationAffichage === "LIVREUR" && (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                LISTE
              </h1>
              <div>
                <div>
                  <Box sx={{ height: "55vh", width: "100%" }}>
                    <DataGrid
                      rows={row_livreur}
                      columns={colonne_livreur}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10]}
                      loading={loading}
                      // checkboxSelection
                    />
                  </Box>
                </div>
              </div>
            </div>
          )}

          {ActivationAffichage === "DOCUMENTS" && (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                LISTE
              </h1>
              <div>
                <div>
                  <Box sx={{ height: "55vh", width: "100%" }}>
                    <DataGrid
                      rows={row_documents}
                      columns={colonne_Documents}
                      pageSize={5}
                      rowsPerPageOptions={[5, 10]}
                      loading={loading}
                      // checkboxSelection
                    />
                  </Box>
                </div>
              </div>
            </div>
          )}

          {ActivationAffichage === "InsertionRemise" && (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                INSERTION
              </h1>
              <select
                value={pourcetang}
                onChange={(e) => setpourcetang(e.target.value)}
                className="p-3 mx-[35%] mb-8 px-[10%] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value={"pourcetang"}>POURCENTAGE</option>
                <option value={"valeur"}>VALEUR</option>
              </select>

              <div className="grid grid-cols-4 gap-4">
                <div></div>
                <div>
                  <form>
                    {pourcetang === "pourcetang" ? (
                      <div className="flex items-center gap-6">
                        <label
                          htmlFor="champ1"
                          className="text-sm font-medium text-gray-700"
                        >
                          POURCENTAGE:
                        </label>
                        <input
                          id="pourcentage"
                          type="number"
                          className="border p-4  border-gray-300 rounded-md px-[50%] py-2"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-6">
                        <label
                          htmlFor="champ1"
                          className="text-sm font-medium text-gray-700 text-3xl"
                        >
                          VALEUR:
                        </label>
                        <input
                          id="valeur"
                          type="number"
                          className="border border-gray-300 rounded-md px-[50%] py-2"
                        />
                      </div>
                    )}
                    <div className="mt-8 ml-[50%] flex   gap-6">
                      <button
                        type="submit"
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
                      >
                        VALIDER
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
                      >
                        REFRECHIR
                      </button>
                    </div>
                  </form>
                </div>
                <div></div>
              </div>
            </div>
          )}

          {ActivationAffichage === "insertionTiers" && (
            <div>
              <form
                onSubmit={handleSubmit_tier}
                className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-6"
              >
                <h1 className="text-center text-2xl font-bold text-blue-600 mb-6">
                  CREATION
                </h1>

                {/* Grid principale : 2 champs par ligne */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      label: "Nom",
                      name: "nomTier",
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Zone",
                      name: "zone",
                      type: "text",
                      required: true,
                    },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Contact", name: "contact", type: "text" },
                    { label: "NIF", name: "nif", type: "text" },
                    { label: "Stat", name: "stat", type: "text" },
                    { label: "RCS", name: "rcs", type: "text" },
                    { label: "Commerce", name: "commercial", type: "text" },
                  ].map((field) => (
                    <div key={field.name} className="flex items-center gap-4">
                      <label className="w-32 font-medium text-gray-700">
                        {field.label}
                        {field.required && (
                          <span className="text-red-600">***</span>
                        )}{" "}
                        :
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formDataT[field.name]}
                        onChange={handleChangeT}
                        required={field.required || false}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  {/* Type et Mot de passe conditionnel */}
                  <div className="flex items-center gap-4">
                    <label className="w-32 font-medium text-gray-700">
                      TYPE<span className="text-red-600">***</span> :
                    </label>
                    <select
                      name="type"
                      value={formDataT.type}
                      onChange={(e) => {
                        handleChangeT(e);
                        if (e.target.value !== "Livreur") {
                          setFormDataT((prev) => ({ ...prev, motDePasse: "" }));
                        }
                      }}
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">...</option>
                      <option value="Fournisseur">Fournisseur</option>
                      <option value="Client">Client</option>
                      <option value="Livreur">Livreur</option>
                    </select>
                  </div>

                  {formDataT.type === "Livreur" && (
                    <div className="flex items-center gap-4">
                      <label className="w-32 font-medium text-gray-700">
                        MOT DE PASSE<span className="text-red-600">***</span> :
                      </label>
                      <input
                        type="password"
                        name="motDePasse"
                        value={formDataT.motDePasse}
                        onChange={handleChangeT}
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
                  >
                    VALIDER
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect("ListeTiers")}
                    className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>
              </form>
            </div>
          )}

          {ActivationAffichage === "ListeTiers" && (
            <div>
              <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-2xl p-6 mb-6 w-[110%]">
                <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">
                  LISTE TIERS
                </h1>

                {/* FORMULAIRE DE RECHERCHE */}
                <form
                  onSubmit={handleSearcheSubmitTIERS}
                  className="flex flex-wrap gap-4 items-center"
                >
                  {/* Nom */}
                  <select
                    id="nomTier"
                    name="nomTier"
                    value={formDataSearcheTIERS.nomTier}
                    onChange={handleChangeSearcheTIERS}
                    className="w-25 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""> </option>
                    {[
                      ...new Set(
                        OriginalListeTIERS.map((item) => item.nomTier)
                      ),
                    ].map((nomTier, index) => (
                      <option key={`nom-${index}`} value={nomTier}>
                        {nomTier}
                      </option>
                    ))}
                  </select>

                  {/* Type */}
                  <select
                    id="type"
                    name="type"
                    value={formDataSearcheTIERS.type}
                    onChange={handleChangeSearcheTIERS}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""></option>
                    {[
                      ...new Set(OriginalListeTIERS.map((item) => item.type)),
                    ].map((type, index) => (
                      <option key={`type-${index}`} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {/* Zone */}
                  <select
                    id="zone"
                    name="zone"
                    value={formDataSearcheTIERS.zone}
                    onChange={handleChangeSearcheTIERS}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""></option>
                    {[
                      ...new Set(OriginalListeTIERS.map((item) => item.zone)),
                    ].map((zone, index) => (
                      <option key={`zone-${index}`} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
                  >
                    FILTRER
                  </button>

                  <button
                    type="button"
                    onClick={handleRefreshTIERS}
                    className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                  >
                    RAFRAICHIR
                  </button>
                </form>
              </div>

              <Box sx={{ height: "55vh", width: "110%" }}>
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

          {ActivationAffichage === "detailTier" && Donne_Tier && (
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
                DÉTAIL Mr/Mn <strong>{Donne_Tier.nomTier}</strong>
              </h1>

              {/* Grille 3 colonnes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">NOM :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.nomTier}</strong>
                  </span>
                </div>
                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">TYPE :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.type}</strong>
                  </span>
                </div>
                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">ZONE :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.zone}</strong>
                  </span>
                </div>

                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">CONTACT :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.contact}</strong>
                  </span>
                </div>
                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">EMAIL :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.email}</strong>
                  </span>
                </div>
                <div className="p-3  rounded-lg flex gap-4">
                  <span className="font-semibold text-gray-600">
                    MOT DE PASSE :
                  </span>
                  <span className="  rounded-lg flex gap-6">
                    <strong>{Donne_Tier.motDePasse}</strong>
                  </span>
                </div>

                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">NIF :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.nif}</strong>
                  </span>
                </div>
                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">STAT :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.stat}</strong>
                  </span>
                </div>
                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">RCS :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.rcs}</strong>
                  </span>
                </div>

                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">
                    COMMERCIAL :
                  </span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.commercial}</strong>
                  </span>
                </div>
                <div className="p-3  rounded-lg flex gap-6">
                  <span className="font-semibold text-gray-600">ETAT :</span>
                  <span className="block text-gray-800">
                    <strong>{Donne_Tier.colonne}</strong>
                  </span>
                </div>
              </div>

              {/* Bouton fermer centré */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleSelect("ListeTiers")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {ActivationAffichage === "modifTIERS" && (
            <form
              onSubmit={ModifeTier}
              className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto space-y-6"
            >
              <div className="grid grid-cols-2 gap-6">
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
                  <div key={field.name} className="flex items-center gap-4">
                    <label className="w-32 font-medium">{field.label} :</label>
                    <input
                      type={field.type}
                      value={modife_Tier[field.name]}
                      onChange={(e) =>
                        setmodife_Tier({
                          ...modife_Tier,
                          [field.name]: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Modifier
                </button>
              </div>
            </form>
          )}

          {ActivationAffichage === " " && (
            <div>
              <h1 className="text-2xl font-bold text-blue-500 mt-6 mb-4 underline">
                Statistiques
              </h1>

              <div className=" grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-3 overflow-x-auto">
                  <BarChart
                    xAxis={[
                      { data: ["Categorie A", "Categorie B", "Categorie C"] },
                    ]}
                    series={[
                      { data: [4, 6, 3] },
                      { data: [2, 4, 5] },
                      { data: [4, 3, 7] },
                    ]}
                    height={300}
                  />
                </div>
                <div className="flex flex-col justify-center space-y-3 ml-0 md:ml-6">
                  <div>
                    <span className="bg-blue-800 text-blue-800 rounded px-2">
                      G
                    </span>
                    <strong className="ml-2">Série 1</strong>
                  </div>
                  <div>
                    <span className="bg-red-500 text-red-500 rounded px-2">
                      G
                    </span>
                    <strong className="ml-2">Série 2</strong>
                  </div>
                  <div>
                    <span className="bg-yellow-400 text-yellow-400 rounded px-2">
                      G
                    </span>
                    <strong className="ml-2">Série 3</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
