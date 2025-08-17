import React, { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import api from "./api/axios";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import { Navbar } from "./componets/navbar";
import {
  Authentication,
  Creation_consommateur,
} from "./componets/authentification";
import { CreateSuperUser } from "./componets/create_super_admin";
import { SuperUtilisateur } from "./componets/insertions/insertion_super_utilisater";
import { ListeUtilisateur } from "./componets/affichage/liste_utilisateur";
import { Suivi_achat } from "./componets/affichage/pageConsommateur/suivi_achat";
import { Acceuil } from "./componets/affichage/acceuil";
import Discution from "./componets/affichage/message";
import { Consomateur } from "./componets/insertions/consommateur";
import { IndexConsommateur } from "./componets/affichage/pageConsommateur";
import { AcceuilConsommater } from "./componets/affichage/pageConsommateur/compte";
import { Transaction } from "./componets/affichage/pageConsommateur/transaction";
import { Reception } from "./componets/affichage/pageConsommateur/reception";
import { AcceuilUtilisateur } from "./componets/affichage/utilisateur";
import Login from "./Login";

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Erreur Axios :", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des utilisateurs</h1>
      <ul className="list-disc pl-5 space-y-1">
        {users.map((user) => (
          <li key={user.id}>
            {user.nom} {user.prenom} - {user.email || user.contact}
          </li>
        ))}
      </ul>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <ProtectedRoute>
      <div>
        <Acceuil />
      </div>

      // </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/cree", element: <Consomateur /> },
  { path: "/pageconsommateur", element: <IndexConsommateur /> },
  { path: "/message", element: <Discution /> },
  { path: "/AcceuilConso", element: <AcceuilConsommater /> },
  {
    path: "/cree_super_utilisateur",
    element: (
      <div>
        {/* <Navbar /> */}
        <SuperUtilisateur />
      </div>
    ),
  },
  {
    path: "/liste_super_utilisateur",
    element: (
      <div>
        <Navbar />
        <ListeUtilisateur />
      </div>
    ),
  },
  {
    path: "/users",
    element: (
      <div>
        <Navbar />
        <UsersPage />
      </div>
    ),
  },
  {
    path: "/suivit",
    element: (
      <div>
        {/* <Navbar /> */}
        <Suivi_achat />
      </div>
    ),
  },
  {
    path: "/Transaction",
    element: (
      <div>
        <Transaction />
      </div>
    ),
  },
  {
    path: "/réception",
    element: (
      <div>
        {/* <Navbar /> */}
        <Reception />
      </div>
    ),
  },
  {
    path: "/utilisateur",
    element: (
      <div>
        {/* <Navbar /> */}
        <AcceuilUtilisateur />
      </div>
    ),
  },
  AcceuilUtilisateur,
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
