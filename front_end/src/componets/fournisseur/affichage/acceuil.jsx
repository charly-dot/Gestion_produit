import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Consomateur } from "../../insertions/consommateur";
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import { AuthContext } from "./../../../AuthContext";

//tableau
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { NavbarFournisseur } from "../navbar";

export function IndexF() {
  const { DonneSession, logout } = useContext(AuthContext);

  const [showU, setShowU] = useState(false);
  const [showC, setShowC] = useState(false);
  const [showd, setShowd] = useState(" ");
  const [user, setUser] = useState([]); // pour stocker la liste des utilisateurs
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = React.useState("");
  const [message, setMessage] = useState(null);
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000); // disparaît après 3 sec
  };

  const [originalListeC, setOriginalListeC] = useState([]);
  const [ListeC, setListeC] = useState([]);

  const [originalListeG, setOriginalListeG] = useState([]);
  const [ListeG, setListeG] = useState([]);

  ///fournisserur
  const columns = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "nom", headerName: "NOM", width: 150 },
    { field: "prenom", headerName: "PRENOM", width: 180 },
    { field: "sexe", headerName: "SEXE", width: 100 },
    { field: "groupe", headerName: "ROLE", width: 100 },
    { field: "contact", headerName: "CONTACT", width: 150 },
    { field: "email", headerName: "EMAIL", width: 200 },
    {
      field: "detail",
      headerName: "DETAILS",
      width: 100,
      renderCell: (params) => (
        <button
          onClick={() => {
            setSelectedUserId(params.row.id); // récupère l'ID réel
            setShowd("listedetail");
            fetchUser(params.row.id); // appelle l'API pour récupérer l'utilisateur
          }}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEye size={25} className="ml-6 mt-2" />
        </button>
      ),
    },
  ];

  const handleSelect = (page) => {
    setShowd(page);
    setShowU(false);
    setShowC(false);
  };

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

      setSuccess(true);
      liste();
      setShowd("liste");
      showMessage("success", "Insertion avec succès ");
    } catch (err) {
      console.error("Erreur :", err);
      setError("Information incorrecte");
    }
  };

  const liste = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_utilisateur"
      );
      setUser(response.data);
      console.log(response.data);
    } catch (err) {
      setErrors("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/liste_utilisateur/${id}`
      );
      setSelectedUser(response.data); // stocke les infos complètes
    } catch (err) {
      setError("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUtilisateur = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?"))
      return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/supprimer_super_utilisateur/${id}`
      );
      liste();
      listeC();
      setShowd("liste");
      showMessage("success", "Suppression avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression ❌");
    }
  };

  const handleEtatUtilisateur = async (user) => {
    const newStatus = user.activation === "activer" ? "desactiver" : "activer";
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/changer_activation/${user.id}`,
        { activation: newStatus }
      );

      // Mettre à jour la liste locale
      setListeGroupe((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? { ...item, activation: response.data.activation }
            : item
        )
      );
      setSelectedUser((prev) =>
        prev.id === user.id
          ? { ...prev, activation: response.data.activation }
          : prev
      );
    } catch (err) {
      console.error("Erreur activation:", err);
      setError("Erreur lors de la modification de l'activation.");
    }
  };

  //  modification de la fournisserur

  const [listeUtilisateur, setListeUtilisateur] = useState([]);

  const [formData_Utilisateur, setFormData_Utilisateur] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    role: "",
    contact: "",
    email: "",
    profil: null, // Pour l'upload du profil
  });

  const modification_Utilisateur = (user) => {
    setSelectedUser(user);
    setFormData_Utilisateur({
      nom: user.nom,
      prenom: user.prenom,
      sexe: user.sexe,
      role: user.role,
      contact: user.contact || "",
      email: user.email,
      profil: null, // reset upload
    });
    setShowd("editUtilisateur");
  };

  const handleChange_Utilisateur = (e) => {
    const { name, value } = e.target;
    setFormData_Utilisateur((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit_Utilisateurs = async (e) => {
    e.preventDefault();
    try {
      // Préparer FormData pour l'upload
      const data = new FormData();
      for (let key in formData_Utilisateur) {
        if (formData_Utilisateur[key] !== null) {
          data.append(key, formData_Utilisateur[key]);
        }
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/modifier_utilisateur/${selectedUser.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Mise à jour liste et utilisateur sélectionné
      setListeUtilisateur((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...formData_Utilisateur } : u
        )
      );
      setSelectedUser((prev) => ({ ...prev, ...formData_Utilisateur }));

      // Retour à la liste
      listeC();
      setShowd("liste");
      showMessage("success", "Modification succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification ❌");
    }
  };

  ///categorie
  const listeC = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_utilisateurC"
      );
      setOriginalListeC(response.data); // garde la liste complète
      setListeC(response.data); // liste affichée
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columnsC = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "nom", headerName: "NOM", width: 250 },
    { field: "type", headerName: "TYPE", width: 170 },
    { field: "etat", headerName: "ETATS ACTUELLES", width: 170 },

    // Bouton Modifier
    {
      field: "modification",
      headerName: "MODIFICATION",
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => {
            setModifCategorie(params.row); // ✅ mettre la ligne sélectionnée
            setShowd("modifC"); // ✅ ouvrir le formulaire de modification
          }}
          className="text-green-500 hover:text-green-700"
        >
          Modifier
        </button>
      ),
    },

    // Bouton Supprimer
    {
      field: "suppression",
      headerName: "SUPPRESSION",
      width: 120,
      renderCell: (params) => (
        <button
          onClick={() => handleDeleteCategorie(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          Supprimer
        </button>
      ),
    },

    // Bouton Activation/Désactivation
    {
      field: "etatBtn",
      headerName: "ACTION ETATS",
      width: 140,
      renderCell: (params) => (
        <button
          onClick={() => handleEtatCategorie(params.row)}
          className={`${
            params.row.etat === "activer"
              ? "text-orange-400 hover:text-orange-500"
              : "text-green-500 hover:text-green-600"
          }`}
        >
          {params.row.etat === "activer" ? "Désactiver" : "Activer"}
        </button>
      ),
    },
  ];

  const [formDataC, setFormDataC] = useState({
    nom: "",
    type: "",
  });

  const handleChangeC = (e) => {
    const { name, value } = e.target;
    setFormDataC((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCategorie = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const data = new FormData();
      data.append("nom", formDataC.nom);
      data.append("type", formDataC.type);

      await axios.post("http://127.0.0.1:8000/api/creationCategorie", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setFormDataC({ nom: "", type: "" }); // reset
      listeC(); // ✅ recharge la liste

      setShowd("listeC");
      showMessage("success", "Insert avec  succès");
    } catch (err) {
      console.error("Erreur :", err);
      setError("Informations trop courtes ❌");
    }
  };

  const handleDeleteCategorie = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?"))
      return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/supprimer_scategorie/${id}`
      );
      setSuccess(true);
      listeC();
      setShowd("listeC");
      showMessage("success", "Suppression avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression ❌");
    }
  };

  const handleEtatCategorie = async (categorie) => {
    const newStatus = categorie.etat === "activer" ? "desactiver" : "activer";

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/changer_activationCategorie/${categorie.id}`,
        { activation: newStatus }
      );

      setListeC((prev) =>
        prev.map((c) =>
          c.id === categorie.id ? { ...c, etat: response.data.activation } : c
        )
      );

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification de l'activation ❌");
    }
  };

  const [modifCategorie, setModifCategorie] = useState(null);
  const handleEditSubmitCategorie = async (e) => {
    e.preventDefault();
    if (!modifCategorie) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/modifier_categorie/${modifCategorie.id}`,
        {
          nom: modifCategorie.nom,
          type: modifCategorie.type,
          etat: modifCategorie.etat,
        }
      );

      setSuccess(true);
      listeC();
      setShowd("listeC");
      showMessage("success", "Modifiction avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification ❌");
    }
  };

  ///groupe
  const listeG = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_utilisateurC"
      );
      setListeC(response.data);
      console.log(response.data);
    } catch (err) {
      setErrors("Erreur lors du chargement de l'utilisateur.");
    } finally {
      setLoading(false);
    }
  };

  const [ListeGroupe, setListeGroupe] = React.useState([]);
  const [formDataG, setFormDataG] = useState({
    nom: "",
    type: "",
  });

  const [modifGroupe, setModifGroupe] = useState(null);
  const [openModifGroup, setOpenModifGroupe] = useState(false);

  const handleEditSubmitG = async (e) => {
    e.preventDefault();
    if (!modifGroupe) return;

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/modifier_Groupe/${modifGroupe.id}`,
        {
          nom: modifGroupe.nomGroupe,
          type: modifGroupe.type,
          etat: modifGroupe.etat,
        }
      );

      setSuccess(true);
      setModifGroupe(null);
      fetchListeGroupe();
      setShowd("listeGroupe"); // ferme le modal
      showMessage("success", "Modification avec succès");
      // setTimeout(() => handleSelect("listeGroupe"), 2000);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification ❌");
    }
  };

  const handleChangeG = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormDataG({ ...formDataG, [name]: files[0] });
    } else {
      setFormDataG({ ...formDataG, [name]: value });
    }
  };

  const handleSubmitG = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = new FormData();
      data.append("nomGroupe", formDataG.nom);
      data.append("type", formDataG.type);
      data.append("etat", "activer");
      data.append("colonne", false);
      data.append("colonnes", false);

      await axios.post("http://127.0.0.1:8000/api/creationG", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setFormDataG({ nom: "", type: "" });
      await fetchListeGroupe();
      setShowd("listeGroupe");
      showMessage("success", "Insertion avec succès");
    } catch (err) {
      console.error("Erreur :", err);
      setError("Informations trop courtes");
    }
  };

  const columnsG = [
    { field: "id", headerName: "N°", width: 70 },
    { field: "nomGroupe", headerName: "NOM_GROUPE", width: 230 },
    { field: "type", headerName: "TYPE", width: 150 },
    {
      field: "etat",
      headerName: "ETATS ACTUELLES",
      width: 180,
      renderCell: (params) => {
        const value = params.value;

        return (
          <div className="w-full flex justify-center mt-3">
            <span
              className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                value === "activer"
                  ? "bg-red-500"
                  : value === "desactiver"
                  ? "bg-gray-600"
                  : "bg-gray-300"
              }`}
            >
              {value}
            </span>
          </div>
        );
      },
    },

    {
      field: "modification",
      headerName: "MODIFICATION",
      width: 180,
      renderCell: (params) => (
        <button
          onClick={() => {
            setModifGroupe(params.row);
            setShowd("editGroupe");
          }}
          className="text-green-500 hover:text-green-700"
        >
          Modifier
        </button>
      ),
    },
    {
      field: "suppression",
      headerName: "SUPPRESSION",
      width: 150,
      renderCell: (params) => (
        <button
          disabled={loading}
          onClick={() => handleDeleteGroupe(params.row.id)}
          className="text-red-500 hover:text-red-700"
        >
          Supprimer
        </button>
      ),
    },
    {
      field: "etatBtn",
      headerName: "ACTIONS ETATS",
      width: 140,
      renderCell: (params) => (
        <button
          disabled={loading}
          onClick={() => handleEtatGroupe(params.row)}
          className={`${
            params.row.etat === "activer"
              ? "text-orange-400 hover:text-orange-500"
              : "text-green-500 hover:text-green-600"
          }`}
        >
          {params.row.etat === "activer" ? "Désactiver" : "Activer"}
        </button>
      ),
    },
  ];

  const fetchListeGroupe = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/liste_Groupe"
      );
      setOriginalListeG(response.data);
      setListeGroupe(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEtatGroupe = async (row) => {
    const newStatus = row.etat === "activer" ? "desactiver" : "activer";
    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/changer_activationGroupe/${row.id}`,
        { activation: newStatus }
      );

      // Mettre à jour la liste locale sans recharger
      setListeGroupe((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? { ...item, etat: response.data.activation }
            : item
        )
      );
    } catch (err) {
      console.error("Erreur activation:", err);
      setError("Erreur lors de la modification de l'activation.");
    }
  };

  const handleDeleteGroupe = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce groupe ?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/supprimer_Groupe/${id}`);
      fetchListeGroupe();
      // recharge la liste
      setSuccess(true);
      await fetchListeGroupe();
      setShowd("listeGroupe");
      showMessage("success", "Suppserion avec succès");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression ❌");
    }
  };

  // RECHERCHE CATEGORIE
  const [formDataSearcheC, setFormDataSearcheC] = useState({
    nom: "",
    type: "",
    etat: "",
  });

  const handleChangeSearcheC = (e) => {
    const { name, value } = e.target;
    setFormDataSearcheC((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearcheSubmitC = (e) => {
    e.preventDefault();
    const filtered = originalListeC.filter((item) => {
      return (
        (formDataSearcheC.nom === "" || item.nom === formDataSearcheC.nom) &&
        (formDataSearcheC.type === "" || item.type === formDataSearcheC.type) &&
        (formDataSearcheC.etat === "" || item.etat === formDataSearcheC.etat)
      );
    });
    setListeC(filtered);
  };

  const handleRefreshC = () => {
    setFormDataSearcheC({ nom: "", type: "", etat: "" });
    setListeC(originalListeC); // remise à la liste complète
  };

  /// RECHERCHE GROUPE

  const [formDataSearcheG, setFormDataSearcheG] = useState({
    // nomGroupe: "",
    type: "",
    etat: "",
  });

  const handleChangeSearcheG = (e) => {
    const { name, value } = e.target;
    setFormDataSearcheG((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearcheSubmitG = (e) => {
    e.preventDefault();
    const filteredG = originalListeG.filter((item) => {
      return (
        (formDataSearcheG.nomGroupe === "" ||
          item.nomGroupe === formDataSearcheG.nomGroupe) &&
        (formDataSearcheG.type === "" || item.type === formDataSearcheG.type) &&
        (formDataSearcheG.etat === "" || item.etat === formDataSearcheG.etat)
      );
    });
    setListeGroupe(filteredG);
  };

  const handleRefreshG = () => {
    setFormDataSearcheG({ nomGroupe: "", type: "", etat: "" });
    setListeGroupe(originalListeG); // remise à la liste complète
  };
  // Charger les données au montage

  React.useEffect(() => {
    liste(1);
    listeC(1);
    fetchListeGroupe(); // ⚡ utilise le nouveau nom
  }, []);
  if (!DonneSession) {
    return <div className="text-center text-3xl text-red">Chargement...</div>;
  }
  return (
    <div className="container-fluid mx-auto h-screen bg-gray-200 flex flex-col  h-[130%]">
      <NavbarFournisseur />
      <div className="flex flex-grow h-0">
        {/* Colonne 1 : Sidebar */}
        <div className="w-[240px] bg-white shadow-xl px-3 overflow-y-auto">
          {" "}
          <div className="space-y-6 md:space-y-10 mt-10">
            <div id="profile" className="space-y-3">
              <img
                src={
                  DonneSession?.profil
                    ? `http://localhost:8000/storage/${DonneSession.profil}`
                    : "/default-avatar.png"
                }
                alt="Profil"
                className="w-20 h-20 object-cover mx-auto rounded-full border-4 border-blue-500 shadow-md"
              />

              <div>
                <h2 className="font-medium text-xl md:text-sm text-center text-blue-500">
                  {DonneSession.nom}
                </h2>
                <p className="text-xs text-gray-500 text-center">
                  {DonneSession.groupe}
                </p>
              </div>
            </div>

            {/* Menu */}
            <div id="menu" className="flex flex-col space-y-2">
              {/* Utilisateur */}
              <div>
                <h1
                  onClick={() => setShowU(!showU)}
                  className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white rounded-md transition duration-150 ease-in-out"
                >
                  Utilisateur
                </h1>
                {showU && (
                  <div className="ml-4 mt-1 flex flex-col space-y-1">
                    <a
                      onClick={() => handleSelect("creationU")}
                      className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-blue-400 hover:text-white rounded-md transition"
                    >
                      Crée Utilisateur
                    </a>
                    <a className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-blue-400 hover:text-white rounded-md transition">
                      Groupe
                    </a>
                    <a
                      onClick={() => handleSelect("liste")}
                      className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-blue-400 hover:text-white rounded-md transition"
                    >
                      Liste
                    </a>
                  </div>
                )}
              </div>

              {/* Catégorie */}
              <div>
                <h1
                  onClick={() => setShowC(!showC)}
                  className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white rounded-md transition"
                >
                  Catégorie
                </h1>
                {showC && (
                  <div className="ml-4 mt-1 flex flex-col space-y-1">
                    <a
                      onClick={() => handleSelect("creationG")}
                      className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-blue-400 hover:text-white rounded-md transition"
                    >
                      Crée Catégorie
                    </a>
                    <a
                      onClick={() => handleSelect("listeC")}
                      className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-blue-400 hover:text-white rounded-md transition"
                    >
                      Liste Catégorie
                    </a>
                    <a
                      onClick={() => handleSelect("creationGroupe")}
                      className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-blue-400 hover:text-white rounded-md transition"
                    >
                      Crée Groupe
                    </a>
                    <a
                      onClick={() => handleSelect("listeGroupe")}
                      className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-blue-400 hover:text-white rounded-md transition"
                    >
                      Liste Groupe
                    </a>
                  </div>
                )}
              </div>

              {/* Autres liens */}
              <a className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white rounded-md transition">
                Module
              </a>
              <a className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white rounded-md transition">
                Raccourcis
              </a>
              <a className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white rounded-md transition">
                Agenda
              </a>
              <a className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-blue-500 hover:text-white rounded-md transition">
                Historiques
              </a>
            </div>
          </div>
        </div>

        {/* Contenu dynamique */}

        <div className="p-6 w-[160vh]">
          {showd === "liste" && (
            <div>
              <h1 className="text-2xl ml-[10] font-bold text-blue-500 m-6 underline">
                LISTE UTILISATEURS
              </h1>

              {message && (
                <div
                  className={` right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded shadow-md
      ${message.type === "success" ? "bg-green-500 text-white" : ""}
      ${message.type === "error" ? "bg-red-500 text-white" : ""}
      ${message.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                >
                  {message.text}
                </div>
              )}

              <div>
                <Box sx={{ height: "65vh", width: "110%" }}>
                  <DataGrid
                    rows={user}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                    loading={loading}
                    // checkboxSelection
                  />
                </Box>
              </div>
            </div>
          )}

          {showd === "creationU" && (
            <div className=" px-6 px-4 rounded-lg">
              <form
                onSubmit={handleSubmit}
                className="bg-white w-full max-w-xl sm:p-6 rounded-2xl mx-auto space-y-4"
                style={{
                  boxShadow:
                    "0 6px 15px rgba(0, 0, 0, 0.25), 0 3px 7px rgba(0, 0, 0, 0.05)",
                }}
              >
                <h1 className="text-2xl font-bold text-blue-500 m-6 text-center">
                  CREATION D'UTILISATEUR
                </h1>
                {error && <p className="text-red-500 text-center">{error}</p>}

                {/* Nom + Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label htmlFor="nom" className="font-medium text-sm mb-1">
                      Nom
                    </label>
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="prenom"
                      className="font-medium text-sm mb-1"
                    >
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      type="text"
                      name="prenom"
                      required
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Contact + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label
                      htmlFor="contact"
                      className="font-medium text-sm mb-1"
                    >
                      Contact
                    </label>
                    <input
                      id="contact"
                      type="text"
                      name="contact"
                      required
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="email" className="font-medium text-sm mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div className="flex flex-col">
                  <label
                    htmlFor="motDePasse"
                    className="font-medium text-sm mb-1"
                  >
                    Mot de passe
                  </label>
                  <input
                    id="motDePasse"
                    type="password"
                    name="motDePasse"
                    required
                    value={formData.motDePasse}
                    onChange={handleChange}
                    minLength={5}
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$"
                    title="Le mot de passe doit contenir au moins 5 caractères, avec au moins une lettre et un chiffre"
                    placeholder="Mot de passe"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Photo de profil */}
                <div className="flex flex-col">
                  <label htmlFor="profil" className="font-medium text-sm mb-1">
                    Profil
                  </label>
                  <input
                    id="profil"
                    type="file"
                    name="profil"
                    required
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Sexe + Groupe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label htmlFor="sexe" className="font-medium text-sm mb-1">
                      Sexe
                    </label>
                    <select
                      id="sexe"
                      name="sexe"
                      required
                      value={formData.sexe}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="Homme">Homme</option>
                      <option value="Femme">Femme</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="groupe"
                      className="font-medium text-sm mb-1"
                    >
                      Groupe
                    </label>
                    <select
                      id="groupe"
                      name="groupe"
                      required
                      value={formData.groupe}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="Consommateur">Consommateur</option>
                      <option value="fournisseur">Fournisseur</option>
                      <option value="entité">Entité</option>
                    </select>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-3">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-500 text-white py-1.5 px-4 rounded-lg hover:bg-blue-600 transition text-sm"
                  >
                    VALIDER
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelect("")}
                    className="w-full sm:w-auto bg-red-500 text-white py-1.5 px-4 rounded-lg hover:bg-gray-400 transition text-sm"
                  >
                    ANNULER
                  </button>
                </div>
              </form>
            </div>
          )}

          {showd === "listedetail" && selectedUser && (
            <div className="ml-8">
              {/* <div className="flex justify-center text-lg font-bold mb-6 gap-6">
                  <button
                    onClick={() => setShowd("liste")}
                    className="border border-white border-b-black text-black py-4 px-10"
                  >
                    Retour à la liste
                  </button>
                </div> */}

              <div
                style={{
                  boxShadow:
                    "0 8px 20px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.08)",
                }}
                className="bg-white  ml-[10%]  rounded-2xl shadow-lg p-6 w-full max-w-md text-center transform transition duration-300 hover:scale-[1.02]"
              >
                <h1 className="text-2xl font-bold text-blue-500 m-6 ">
                  DETAIL
                </h1>
                <div className="flex justify-center">
                  <img
                    src={
                      selectedUser.profil
                        ? `http://127.0.0.1:8000/storage/${selectedUser.profil}`
                        : "https://via.placeholder.com/100"
                    }
                    alt={selectedUser.nom}
                    className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md"
                  />
                </div>

                <div className="bg-white rounded-xl max-w-lg mx-auto mt-4 text-left space-y-2 text-gray-700">
                  <div className="bg-white rounded-xl max-w-lg mx-auto ml-[20%] mt-4 text-left space-y-2 text-gray-700">
                    <div className="grid grid-cols-3 w-[90%]">
                      <div className="grid grid-cols-2 gap-[50%]">
                        <strong>Nom</strong>:
                      </div>
                      <div>{selectedUser.nom}</div>
                    </div>

                    <div className="grid grid-cols-3 w-[90%]">
                      <div className="grid grid-cols-2 gap-[50%]">
                        <strong>Prénom</strong>:
                      </div>
                      <div>{selectedUser.prenom}</div>
                    </div>

                    <div className="grid grid-cols-3 w-[90%]">
                      <div className="grid grid-cols-2 gap-[50%]">
                        <strong>Sexe</strong>:
                      </div>
                      <div>{selectedUser.sexe}</div>
                    </div>

                    <div className="grid grid-cols-3 w-[90%]">
                      <div className="grid grid-cols-2 gap-[50%]">
                        <strong>Rôle</strong>:
                      </div>
                      <div>{selectedUser.role}</div>
                    </div>

                    <div className="grid grid-cols-3 w-[90%]">
                      <div className="grid grid-cols-2 gap-[50%]">
                        <strong>Contact</strong>:
                      </div>
                      <div>{selectedUser.contact || "-"}</div>
                    </div>

                    <div className="grid grid-cols-3 w-[90%]">
                      <div className="grid grid-cols-2 gap-[50%]">
                        <strong>Email</strong>:
                      </div>
                      <div>{selectedUser.email}</div>
                    </div>
                  </div>
                  <br />
                  <div className="mt-8 flex justify-center gap-4">
                    <button
                      onClick={() => handleEtatUtilisateur(selectedUser)}
                      className={`px-5 py-2 rounded-lg text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105 ${
                        selectedUser.activation === "activer"
                          ? "bg-orange-400 hover:bg-orange-500"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {selectedUser.activation === "activer"
                        ? "Désactiver"
                        : "Activer"}
                    </button>

                    <button
                      onClick={() => modification_Utilisateur(selectedUser)}
                      className="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDeleteUtilisateur(selectedUser.id)}
                      className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg transition transform hover:-translate-y-1 hover:scale-105"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showd === "editUtilisateur" && selectedUser && (
            <div>
              <form
                onSubmit={handleEdit_Utilisateurs}
                className="p-6 bg-white rounded-md mt-4 max-w-md mx-auto space-y-5 shadow-lg"
                style={{
                  boxShadow:
                    "0 8px 20px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.08)",
                }}
              >
                {/* Photo de profil centrée */}
                <div className="flex flex-col items-center">
                  <label className="block font-semibold mb-2 text-blue-500">
                    Modificaton du Mr/Mn {formData_Utilisateur.nom}
                  </label>

                  {selectedUser.profil && (
                    <img
                      src={`http://127.0.0.1:8000/storage/${selectedUser.profil}`}
                      alt="Profil"
                      className="w-24 h-24 rounded-full mt-2 object-cover border shadow-sm"
                    />
                  )}
                  <input
                    type="file"
                    name="profil"
                    onChange={(e) =>
                      setFormData_Utilisateur((prev) => ({
                        ...prev,
                        profil: e.target.files[0],
                      }))
                    }
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition mt-2"
                  />
                </div>

                {/* Nom et Prénom */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Nom</label>
                    <input
                      name="nom"
                      value={formData_Utilisateur.nom}
                      onChange={handleChange_Utilisateur}
                      placeholder="Nom"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Prénom</label>
                    <input
                      name="prenom"
                      value={formData_Utilisateur.prenom}
                      onChange={handleChange_Utilisateur}
                      placeholder="Prénom"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Sexe et Rôle */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Sexe</label>
                    <select
                      name="sexe"
                      value={formData_Utilisateur.sexe}
                      onChange={handleChange_Utilisateur}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    >
                      <option value="homme">Homme</option>
                      <option value="femme">Femme</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Rôle</label>
                    <select
                      name="role"
                      value={formData_Utilisateur.role}
                      onChange={handleChange_Utilisateur}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    >
                      <option value="fournisseur">Fournisseur</option>
                      <option value="entité">Entité</option>
                    </select>
                  </div>
                </div>

                {/* Contact et Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-2">Contact</label>
                    <input
                      name="contact"
                      value={formData_Utilisateur.contact}
                      onChange={handleChange_Utilisateur}
                      placeholder="Contact"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">Email</label>
                    <input
                      name="email"
                      value={formData_Utilisateur.email}
                      onChange={handleChange_Utilisateur}
                      placeholder="Email"
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-4">
                  <button
                    type="submit"
                    className="w-1/3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-95"
                  >
                    VALIDER
                  </button>
                  <button
                    type="button"
                    className="w-1/3 bg-red-400 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-95"
                  >
                    ANNULER
                  </button>
                </div>
              </form>
            </div>
          )}

          {showd === "creationG" && (
            <div>
              <h1 className="ml-[10%] text-2xl font-bold text-blue-500 m-6 underline">
                CREE CATEGORIE
              </h1>
              {error && <p className="text-red-500 text-center">{error}</p>}

              <div>
                <form
                  action=""
                  onSubmit={handleSubmitCategorie}
                  method="post"
                  className="p-6 bg-white rounded-md mt-4 max-w-lg mx-auto space-y-6 shadow-lg"
                  style={{
                    boxShadow:
                      "0 8px 20px rgba(0, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  {/* Nom */}
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <label
                      htmlFor="nom"
                      className="font-medium text-right md:text-left"
                    >
                      NOM :
                    </label>
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      required
                      value={formDataC.nom}
                      onChange={handleChangeC}
                      className="md:col-span-3 w-full px-4 py-3 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition duration-150"
                    />
                  </div>

                  {/* Type */}
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <label
                      htmlFor="type"
                      className="font-medium text-right md:text-left"
                    >
                      TYPE :
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formDataC.type}
                      onChange={handleChangeC}
                      className="md:col-span-3 w-full px-4 py-3 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition duration-150"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="stock">Stock</option>
                      <option value="flotte">Flotte</option>
                    </select>
                  </div>

                  {/* Boutons */}
                  <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-6">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-500 text-white py-3 px-8 rounded-lg 
                 hover:bg-blue-600 transition"
                    >
                      VALIDER
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto bg-red-500 text-white py-3 px-8 rounded-lg 
                 hover:bg-red-600 transition"
                    >
                      ANNULER
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showd === "listeC" && (
            <div>
              <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-2xl p-6 mb-6 w-[110%]">
                <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-0">
                  LISTE CATEGORIES
                </h1>

                <form
                  onSubmit={handleSearcheSubmitC}
                  className="flex flex-wrap gap-4 items-center"
                >
                  {/* Nom */}
                  <select
                    id="nom"
                    name="nom"
                    value={formDataSearcheC.nom}
                    onChange={handleChangeSearcheC}
                    className="w-25 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""> </option>
                    {[...new Set(originalListeC.map((item) => item.nom))].map(
                      (nom, index) => (
                        <option key={`nom-${index}`} value={nom}>
                          {nom}
                        </option>
                      )
                    )}
                  </select>

                  {/* Type */}
                  <select
                    id="type"
                    name="type"
                    value={formDataSearcheC.type}
                    onChange={handleChangeSearcheC}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""></option>
                    {[...new Set(originalListeC.map((item) => item.type))].map(
                      (type, index) => (
                        <option key={`type-${index}`} value={type}>
                          {type}
                        </option>
                      )
                    )}
                  </select>

                  {/* Etat */}
                  <select
                    id="etat"
                    name="etat"
                    value={formDataSearcheC.etat}
                    onChange={handleChangeSearcheC}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""></option>
                    {[...new Set(originalListeC.map((item) => item.etat))].map(
                      (etat, index) => (
                        <option key={`etat-${index}`} value={etat}>
                          {etat}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="submit"
                    className="bg-cyan-500 text-white py-2 px-6 rounded-lg hover:bg-cyan-600 transition"
                  >
                    FILTRER
                  </button>

                  <button
                    type="button"
                    onClick={handleRefreshC}
                    className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                  >
                    RAFRAICHIR
                  </button>
                </form>
              </div>

              {message && (
                <div
                  className={` right-4 bg-green-200 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded shadow-md
      ${message.type === "success" ? "bg-green-500 text-white" : ""}
      ${message.type === "error" ? "bg-red-500 text-white" : ""}
      ${message.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                >
                  {message.text}
                </div>
              )}

              <Box sx={{ height: "65vh", width: "110%" }}>
                <DataGrid
                  rows={ListeC} // Utilise directement l'id réel
                  columns={columnsC}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  loading={loading}
                  // checkboxSelection
                />
              </Box>
            </div>
          )}

          {showd === "creationCategorie" && (
            <div>
              <h1 className="text-2xl font-bold mb-4">Créer Groupe</h1>
              {error && <p className="text-red-500 text-center">{error}</p>}
              {success && (
                <p className="text-green-600 font-semibold text-center">
                  Le groupe a été sauvegardé
                </p>
              )}
              <div>
                <form action="" onSubmit={handleEditSubmitC} method="post">
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2">
                    <label htmlFor="nom" className="font-medium">
                      <strong>Nom</strong>
                    </label>
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      required
                      value={formDataC.nom} // ✅ correction
                      onChange={handleChangeC} // ⚡ utiliser handleChangeG
                      className="md:col-span-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2">
                    <label htmlFor="type" className="font-medium">
                      <strong>Type</strong>
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formDataC.type} // ✅ correction
                      onChange={handleChangeC} // ⚡ utiliser handleChangeG
                      className="md:col-span-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="stock">Stock</option>
                      <option value="flotte">Flotte</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mt-6">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-cyan-500 text-white py-2 px-6 rounded-lg hover:bg-cyan-600 transition"
                    >
                      Créer
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-gray-400 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {modifCategorie && showd === "modifC" && (
            <div>
              <h1 className="ml-[8%] text-2xl font-bold text-blue-500 m-6 underline">
                MODIFICATION CATEGORIE
              </h1>
              <form
                onSubmit={handleEditSubmitCategorie}
                className="p-6 bg-white rounded-md mt-4 max-w-lg ml-[12%] space-y-6 shadow-lg"
                style={{
                  boxShadow:
                    "0 8px 20px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Nom */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <label htmlFor="nom" className="md:w-1/4 font-medium">
                    NOM :
                  </label>
                  <input
                    id="nom"
                    type="text"
                    value={modifCategorie.nom}
                    onChange={(e) =>
                      setModifCategorie({
                        ...modifCategorie,
                        nom: e.target.value,
                      })
                    }
                    className="md:w-3/4 w-full px-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition duration-150"
                    placeholder="Nom"
                  />
                </div>

                {/* Type */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <label htmlFor="type" className="md:w-1/4 font-medium">
                    TYPE :
                  </label>
                  <select
                    id="type"
                    value={modifCategorie.type}
                    onChange={(e) =>
                      setModifCategorie({
                        ...modifCategorie,
                        type: e.target.value,
                      })
                    }
                    className="md:w-3/4 w-full px-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition duration-150"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="stock">Stock</option>
                    <option value="flotte">Flotte</option>
                  </select>
                </div>

                {/* État */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <label htmlFor="etat" className="md:w-1/4 font-medium">
                    ÉTAT :
                  </label>
                  <select
                    id="etat"
                    value={modifCategorie.etat}
                    onChange={(e) =>
                      setModifCategorie({
                        ...modifCategorie,
                        etat: e.target.value,
                      })
                    }
                    className="md:w-3/4 w-full px-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition duration-150"
                  >
                    <option value="activer">Activer</option>
                    <option value="desactiver">Désactiver</option>
                  </select>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-500 text-white py-3 px-8 rounded-lg
                 hover:bg-blue-600 transition"
                  >
                    VALIDER
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-red-500 text-white py-3 px-8 rounded-lg
                 hover:bg-red-600 transition"
                  >
                    ANNULER
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* categorie */}
          {/* groupe */}
          {modifGroupe && showd === "editGroupe" && (
            <div>
              <h1 className="ml-[8%] text-2xl font-bold text-blue-500 m-6 underline">
                MODOFICATION GROUPE
              </h1>
              <form
                onSubmit={handleEditSubmitG}
                className="p-6 bg-white rounded-md mt-4 max-w-lg ml-[10%] space-y-6 shadow-lg"
                style={{
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                {/* Nom du Groupe */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <label htmlFor="nomGroupe" className="md:w-1/4 font-medium">
                    NOM :
                  </label>
                  <input
                    id="nomGroupe"
                    type="text"
                    value={modifGroupe.nomGroupe}
                    onChange={(e) =>
                      setModifGroupe({
                        ...modifGroupe,
                        nomGroupe: e.target.value,
                      })
                    }
                    className="md:w-3/4 w-full px-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition duration-150"
                    placeholder="Nom du groupe"
                  />
                </div>

                {/* Type */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <label htmlFor="type" className="md:w-1/4 font-medium">
                    TYPE :
                  </label>
                  <select
                    id="type"
                    value={modifGroupe.type}
                    onChange={(e) =>
                      setModifGroupe({ ...modifGroupe, type: e.target.value })
                    }
                    className="md:w-3/4 w-full px-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition duration-150"
                  >
                    <option value="stock">Stock</option>
                    <option value="flotte">Flotte</option>
                  </select>
                </div>

                {/* État */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                  <label htmlFor="etat" className="md:w-1/4 font-medium">
                    ETAT :
                  </label>
                  <select
                    id="etat"
                    value={modifGroupe.etat}
                    onChange={(e) =>
                      setModifGroupe({ ...modifGroupe, etat: e.target.value })
                    }
                    className="md:w-3/4 w-full px-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition duration-150"
                  >
                    <option value="activer">Activer</option>
                    <option value="desactiver">Désactiver</option>
                  </select>
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-6">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-500 text-white py-3 px-8 rounded-lg
                 hover:bg-blue-600 transition"
                  >
                    Sauvegarder
                  </button>
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-red-500 text-white py-3 px-8 rounded-lg
                 hover:bg-red-600 transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {showd === "listeGroupe" && (
            <div>
              <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-md rounded-2xl p-6 mb-6 w-[110%]">
                {/* Titre */}
                <h1 className="text-2xl font-bold text-blue-500  mb-4 md:mb-0">
                  LISTES GROUPE
                </h1>
                <form
                  onSubmit={handleSearcheSubmitG}
                  className="flex flex-wrap gap-4 items-center"
                >
                  {/* Nom Groupe */}
                  <select
                    id="nom"
                    name="nomGroupe"
                    value={formDataSearcheG.nomGroupe}
                    onChange={handleChangeSearcheG}
                    className="w-25 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""> </option>
                    {[
                      ...new Set(originalListeG.map((item) => item.nomGroupe)),
                    ].map((nom, index) => (
                      <option key={`nom-${index}`} value={nom}>
                        {nom}
                      </option>
                    ))}
                  </select>

                  {/* Type */}
                  <select
                    id="type"
                    name="type"
                    value={formDataSearcheG.type}
                    onChange={handleChangeSearcheG}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""></option>
                    {[...new Set(originalListeG.map((item) => item.type))].map(
                      (type, index) => (
                        <option key={`type-${index}`} value={type}>
                          {type}
                        </option>
                      )
                    )}
                  </select>

                  {/* État */}
                  <select
                    id="etat"
                    name="etat"
                    value={formDataSearcheG.etat}
                    onChange={handleChangeSearcheG}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value=""></option>
                    {[...new Set(originalListeG.map((item) => item.etat))].map(
                      (etat, index) => (
                        <option key={`etat-${index}`} value={etat}>
                          {etat}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="submit"
                    className="bg-cyan-500 text-white py-2 px-6 rounded-lg hover:bg-cyan-600 transition"
                  >
                    FILTRER
                  </button>

                  <button
                    type="button"
                    onClick={handleRefreshG}
                    className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
                  >
                    RAFRAICHIR
                  </button>
                </form>

                {/* Filtres */}
              </div>
              {message && (
                <div
                  className={`ml-[8%] right-4 bg-green-300 text-white pt-6 pb-6 px-[20%] text-center m-8 rounded shadow-md
      ${message.type === "success" ? "bg-green-500 text-white" : ""}
      ${message.type === "error" ? "bg-red-500 text-white" : ""}
      ${message.type === "warning" ? "bg-orange-500 text-white" : ""}`}
                >
                  {message.text}
                </div>
              )}
              <Box sx={{ height: "65vh", width: "110%" }}>
                <DataGrid
                  rows={ListeGroupe}
                  columns={columnsG}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  loading={loading}
                  getRowId={(row) => row.id}
                />
              </Box>
            </div>
          )}

          {showd === "creationGroupe" && (
            <div>
              {error && <p className="text-red-500 text-center">{error}</p>}
              {success && (
                <p className="text-green-600 font-semibold text-center"></p>
              )}
              <div>
                <form
                  action=""
                  onSubmit={handleSubmitG}
                  method="post"
                  className="p-6 bg-white rounded-md mt-4 max-w-lg ml-[12%] space-y-6 shadow-lg"
                  style={{
                    boxShadow:
                      "0 8px 20px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <h1 className="ml-[8%] text-2xl font-bold text-center text-blue-500 m-6">
                    CREATION
                  </h1>
                  {/* Nom */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <label htmlFor="nom" className="md:w-1/4 font-medium">
                      NOM :
                    </label>
                    <input
                      id="nom"
                      type="text"
                      name="nom"
                      required
                      value={formDataG.nom}
                      onChange={handleChangeG}
                      className="md:w-3/4 w-full px-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition duration-150"
                      placeholder="Nom"
                    />
                  </div>

                  {/* Type */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <label htmlFor="type" className="md:w-1/4 font-medium">
                      TYPE :
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formDataG.type}
                      onChange={handleChangeG}
                      className="md:w-3/4 w-full px-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500
                 transition duration-150"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="stock">Stock</option>
                      <option value="flotte">Flotte</option>
                    </select>
                  </div>

                  {/* Boutons */}
                  <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-6">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-cyan-500 text-white py-3 px-8 rounded-lg
                 hover:bg-cyan-600 transition"
                    >
                      VALIDER
                    </button>
                    <button
                      type="button"
                      className="w-full sm:w-auto bg-red-500 text-white py-3 px-8 rounded-lg
                 hover:bg-red-600 transition"
                    >
                      ANNULER
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* groupe */}

          {showd === " " && (
            <div>
              <div className="ml-[8%]">
                <h1 className=" text-2xl font-bold text-blue-500 my-4 underline">
                  Notification des tâches importantes (en attente)
                </h1>
                <h3>aucune Notification</h3>
                <h1 className="text-2xl font-bold text-blue-500 mt-6 mb-4 underline">
                  Statistiques
                </h1>
              </div>

              <div className="ml-[8%] grid grid-cols-1 md:grid-cols-4 gap-4">
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

// export default function Sidebar() {
//   const [sidenav, setSidenav] = useState(true);
//   const [showU, setShowU] = useState(false);
//   const [showC, setShowC] = useState(false);

//   return (
//     <div className="font-poppins antialiased h-full w-screen flex flex-row">
//       {/* Bouton mobile */}
//       <button
//         onClick={() => setSidenav(!sidenav)}
//         className="p-2 border-2 bg-blue-500 rounded-md border-gray-200 shadow-lg text-gray-500 focus:bg-teal-500 focus:outline-none focus:text-white absolute top-0 left-0 sm:hidden"
//       >
//         <svg
//           className="w-5 h-5 fill-current"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fillRule="evenodd"
//             d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>

//       {/* Sidebar */}
//       {sidenav && (
//         <div>
//           <div className="bg-white h-screen md:block shadow-xl px-3 w-30 md:w-60 lg:w-60 overflow-x-hidden transition-transform duration-300 ease-in-out">
//             <div className="space-y-6 md:space-y-10 mt-10">
//               {/* Logo */}
//               <h1 className="font-bold text-4xl text-center md:hidden">
//                 D<span className="text-teal-600">.</span>
//               </h1>

//               {/* Profile */}
//               <div id="profile" className="space-y-3">
//                 <img
//                   src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
//                   alt="Avatar user"
//                   className="w-10 md:w-16 rounded-full mx-auto"
//                 />
//                 <div>
//                   <h2 className="font-medium text-xs md:text-sm text-center text-teal-500">
//                     Eduard Pantazi
//                   </h2>
//                   <p className="text-xs text-gray-500 text-center">
//                     Administrator
//                   </p>
//                 </div>
//               </div>

//               {/* Menu */}
//               <div id="menu" className="flex flex-col space-y-2">
//                 {/* Utilisateur */}
//                 <div>
//                   <h1
//                     onClick={() => setShowU(!showU)}
//                     className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white rounded-md transition duration-150 ease-in-out"
//                   >
//                     Utilisateur
//                   </h1>
//                   {showU && (
//                     <div className="ml-4 mt-1 flex flex-col space-y-1">
//                       <a
//                         onClick={() => handleSelect("creationU")}
//                         className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-teal-200 hover:text-gray-900 rounded-md transition"
//                       >
//                         Crée Utilisateur
//                       </a>
//                       <a className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-teal-200 hover:text-gray-900 rounded-md transition">
//                         Groupe
//                       </a>
//                       <a
//                         onClick={() => handleSelect("liste")}
//                         className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-teal-200 hover:text-gray-900 rounded-md transition"
//                       >
//                         Liste
//                       </a>
//                     </div>
//                   )}
//                 </div>

//                 {/* Catégorie */}
//                 <div>
//                   <h1
//                     onClick={() => setShowC(!showC)}
//                     className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white rounded-md transition"
//                   >
//                     Catégorie
//                   </h1>
//                   {showC && (
//                     <div className="ml-4 mt-1 flex flex-col space-y-1">
//                       <a
//                         onClick={() => handleSelect("creationG")}
//                         className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-teal-200 hover:text-gray-900 rounded-md transition"
//                       >
//                         Crée Catégorie
//                       </a>
//                       <a
//                         onClick={() => handleSelect("listeC")}
//                         className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-teal-200 hover:text-gray-900 rounded-md transition"
//                       >
//                         Liste Catégorie
//                       </a>
//                       <a
//                         onClick={() => handleSelect("creationGroupe")}
//                         className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-teal-200 hover:text-gray-900 rounded-md transition"
//                       >
//                         Crée Groupe
//                       </a>
//                       <a
//                         onClick={() => handleSelect("listeGroupe")}
//                         className="cursor-pointer text-gray-600 text-sm py-1 px-2 hover:bg-teal-200 hover:text-gray-900 rounded-md transition"
//                       >
//                         Liste Groupe
//                       </a>
//                     </div>
//                   )}
//                 </div>

//                 {/* Autres liens */}
//                 <a className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white rounded-md transition">
//                   Module
//                 </a>
//                 <a className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white rounded-md transition">
//                   Raccourcis
//                 </a>
//                 <a className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white rounded-md transition">
//                   Agenda
//                 </a>
//                 <a className="cursor-pointer text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white rounded-md transition">
//                   Historiques
//                 </a>
//               </div>
//             </div>
//           </div>

//           <div className="bg-blue-500 rounded  font-bold text-white text-xl px-4 space-y-6">
//             <div>
//               <h1
//                 onClick={() => setShowU(!showU)}
//                 className="cursor-pointer p-4 rounded hover:text-gray-100"
//               >
//                 Utilisateur
//               </h1>
//               {showU && (
//                 <div className="ml-6 space-y-3 text-lg">
//                   <h2
//                     onClick={() => handleSelect("creationU")}
//                     className="cursor-pointer text-gray-100 py-6 hover:text-white"
//                   >
//                     Crée Utilisateur
//                   </h2>
//                   <h2 className="cursor-pointer text-gray-100 py-6 hover:text-white">
//                     Groupe
//                   </h2>
//                   <h2
//                     onClick={() => handleSelect("liste")}
//                     className="cursor-pointer text-gray-100 hover:text-white"
//                   >
//                     Liste
//                   </h2>
//                 </div>
//               )}
//             </div>

//             <div>
//               <h1
//                 onClick={() => setShowC(!showC)}
//                 className="cursor-pointer p-4 py-6 rounded hover:text-gray-100"
//               >
//                 Categorie
//               </h1>
//               {showC && (
//                 <div className="ml-6 space-y-3 text-lg">
//                   <h2
//                     onClick={() => handleSelect("creationG")}
//                     className="cursor-pointer text-gray-100 hover:text-white"
//                   >
//                     Crée Categorie
//                   </h2>
//                   <h2
//                     onClick={() => handleSelect("listeC")}
//                     className="cursor-pointer text-gray-100 hover:text-white"
//                   >
//                     Liste categorie
//                   </h2>
//                   <h2
//                     onClick={() => handleSelect("creationGroupe")}
//                     className="cursor-pointer text-gray-100 hover:text-white"
//                   >
//                     Crée Groupe
//                   </h2>
//                   <h2
//                     onClick={() => handleSelect("listeGroupe")}
//                     className="cursor-pointer text-gray-100 hover:text-white"
//                   >
//                     Liste Groupe
//                   </h2>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-2">
//               <h1 className="cursor-pointer px-4 py-2 py-6 rounded hover:text-gray-100">
//                 Module
//               </h1>
//               <h1 className="cursor-pointer px-4 py-2 py-6 rounded hover:text-gray-100">
//                 Raccourcis
//               </h1>
//               <h1 className="cursor-pointer px-4 py-2 py-6 rounded hover:text-gray-100">
//                 Agenda
//               </h1>
//               <h1 className="cursor-pointer px-4 rounded hover:text-gray-100">
//                 Historiques
//               </h1>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
