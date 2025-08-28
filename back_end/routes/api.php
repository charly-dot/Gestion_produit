<?php

use App\Models\Categorie;
use App\Models\Groupe;
use App\Models\Tier;
use App\Models\Utilisateur;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//// TIERS
Route::get('/liste_TIERS', function () {
    $tiers = \App\Models\Tier::all();

    if ($tiers->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($tiers);
});

Route::post('/creationTiers', function (Request $request) {
    try {
        $Tiers = Tier::create([
            'nomTier'    => $request->nomTier,
            'zone'       => $request->zone,
            'type'       => $request->type,
            'motDePasse' => $request->type === "Livreur" && !empty($request->motDePasse)
                ? $request->motDePasse
                : " ",
            'email'      => $request->email,
            'contact'    => $request->contact,
            'nif'        => $request->nif,
            'stat'       => $request->stat,
            'rcs'        => $request->rcs,
            'commercial' => $request->commercial,
            'colonne'    => 'activer',
            'colonnes'   => false,
        ]);


        return response()->json([
            'message' => 'Tiers inséré avec succès',
            'data'    => $Tiers
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Erreur lors de l’insertion',
            'error'   => $e->getMessage()
        ], 500);
    }
});

// SUPPRESSION
Route::delete('/supprimer_tier/{id}', function ($id) {
    $tier = Tier::find($id);
    if (!$tier) {
        return response()->json(['message' => 'Tier non trouvé'], 404);
    }

    $tier->delete();
    return response()->json(['message' => 'Tier supprimé avec succès ✅']);
});

// CHANGEMENT D’ÉTAT
Route::patch('/changer_activation_tier/{id}', function ($id, Request $request) {
    $tier = Tier::find($id);
    if (!$tier) {
        return response()->json(['message' => 'Tier non trouvé'], 404);
    }

    // Mettre à jour la colonne "colonne" qui sert pour l'état
    $newEtat = $request->activation === "activer" ? "activer" : "desactiver";
    $tier->colonne = $newEtat;
    $tier->save();

    return response()->json([
        'message' => "Tier mis à jour : {$newEtat} ✅",
        'activation' => $tier->colonne  // <-- renvoyer la bonne colonne
    ]);
});

///Modification
Route::put('/modifier_tier/{id}', function ($id, Request $request) {
    $tier = Tier::find($id);
    if (!$tier) return response()->json(['message' => 'Tier non trouvé'], 404);

    $tier->nomTier    = $request->nomTier;
    $tier->zone       = $request->zone;
    $tier->type       = $request->type;
    if ($request->motDePasse) $tier->motDePasse = bcrypt($request->motDePasse);
    $tier->email      = $request->email;
    $tier->contact    = $request->contact;
    $tier->nif        = $request->nif;
    $tier->stat       = $request->stat;
    $tier->rcs        = $request->rcs;
    $tier->commercial = $request->commercial;
    $tier->save();

    return response()->json($tier);
});

///////// categorie
Route::post('/creationCategorie', function (Request $request) {
    $user = Categorie::create([
        'nom'     => $request->nom,
        'etat'    => "activer",
        'type'    => $request->type, // attention à la casse !
        'colonne' => false,
        'colonnes' => false,
    ]);

    return response()->json([
        'message' => 'Super utilisateur créé avec succès',
        'data'    => $user
    ]);
});

Route::delete('/supprimer_scategorie/{id}', function ($id) {
    $user = Categorie::find($id);
    if (!$user) return response()->json(['message' => 'categorie non trouvé'], 404);

    $user->delete();
    return response()->json(['message' => 'Categorie supprimé avec succès']);
});

Route::post('/modifier_categorie/{id}', function ($id, Request $request) {
    $Categorie = Categorie::find($id);
    if (!$Categorie) return response()->json(['message' => 'categorie non trouvé'], 404);
    $Categorie->nom = $request->nom;
    $Categorie->type = $request->type;
    $Categorie->etat = $request->etat;
    $Categorie->colonne =  false;
    $Categorie->colonnes = false;
    $Categorie->save();
    return response()->json($Categorie);
});

Route::get('/liste_utilisateurC', function () {
    $user = \App\Models\Categorie::all();

    if ($user->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($user);
});

// Activer / Désactiver un categorie
Route::patch('/changer_activationCategorie/{id}', function ($id, Request $request) {
    $categorie = Categorie::find($id);
    if (!$categorie) return response()->json(['message' => 'Catégorie non trouvée'], 404);

    $categorie->etat = $request->activation === "activer" ? "activer" : "desactiver";
    $categorie->save();

    return response()->json([
        'message' => "Catégorie " . $request->activation,
        'activation' => $categorie->etat
    ]);
});


/// groupe
Route::get('/liste_Groupe', function () {
    $user = \App\Models\Groupe::all();

    if ($user->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($user);
});

Route::post('/creationG', function (Request $request) {
    $user = Groupe::create([
        'nomGroupe' => $request->nomGroupe,
        'etat'      => "activer",
        'type'      => $request->type,
        'colonne'   => false,
        'colonnes'  => false,
    ]);

    return response()->json([
        'message' => 'Super Groupe créé avec succès',
        'data'    => $user
    ]);
});

Route::patch('/changer_activationGroupe/{id}', function ($id, Request $request) {
    $categorie = Groupe::find($id);
    if (!$categorie) return response()->json(['message' => 'Catégorie non trouvée'], 404);

    $categorie->etat = $request->activation === "activer" ? "activer" : "desactiver";
    $categorie->save();

    return response()->json([
        'message' => "Catégorie " . $request->activation,
        'activation' => $categorie->etat
    ]);
});

Route::delete('/supprimer_Groupe/{id}', function ($id) {
    $user = Groupe::find($id);
    if (!$user) return response()->json(['message' => 'categorie non trouvé'], 404);

    $user->delete();
    return response()->json(['message' => 'Categorie supprimé avec succès']);
});

Route::post('/modifier_Groupe/{id}', function ($id, Request $request) {
    $groupe = Groupe::find($id);
    if (!$groupe) return response()->json(['message' => 'Goupe non trouvé'], 404);
    $groupe->nomGroupe = $request->nom;
    $groupe->type = $request->type;
    $groupe->etat = $request->etat;
    $groupe->colonne =  false;
    $groupe->colonnes = false;
    $groupe->save();
    return response()->json($groupe);
});

///login
Route::post('/login', function (Request $request) {
    if (!$request->has(['email', 'password'])) {
        return response()->json(['message' => 'Champs manquants'], 400);
    }
    $user = Utilisateur::where('email', $request->email)
        ->orWhere('nom', $request->email)
        ->first();

    if (!$user || $user->motDePasse !== $request->password) {
        return response()->json(['message' => 'Identifiants invalides'], 401);
    }
    $token = $user->createToken('authToken')->plainTextToken;
    return response()->json([
        'token' => $token,
        'user' => $user
    ]);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

/// Utilisateur

Route::get('/liste_utilisateur/{id}', function ($id) {
    $user = Utilisateur::find($id);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $user->role = $user->groupe;
    $user->activation = $user->activation ? "activer" : "desactiver";

    return response()->json($user);
});

Route::get('/liste_utilisateur', function () {
    $user = \App\Models\Utilisateur::all();

    if ($user->isEmpty()) {
        return response()->json(['message' => 'Aucun utilisateur trouvé'], 404);
    }

    return response()->json($user);
});

Route::get('/users', function () {
    return response()->json(Utilisateur::all());
});

Route::post('/cree_super_utilisateurs', function (Request $request) {
    $profilPath = null;
    if ($request->hasFile('profil')) {
        $profilPath = $request->file('profil')->store('profils', 'public');
    }

    $user = Utilisateur::create([
        'nom'         => $request->nom,
        'prenom'      => $request->prenom,
        'sexe'        => $request->sexe,
        'motDePasse'  => $request->motDePasse,
        'email'       => $request->email,
        'contact'     => $request->contact,
        'groupe'      => $request->groupe,
        'profil'      => $profilPath,
        'lecture'     => false,
        'suppression' => false,
        'modification' => false,
        'creation'    => false,
        'activation'  => false,
        'colone'      => false,
        'colonee'     => false,
    ]);

    return response()->json([
        'message' => 'Super utilisateur créé avec succès',
        'data'    => $user
    ]);
});

Route::post('/modifier_utilisateur/{id}', function ($id, Request $request) {
    $user = Utilisateur::find($id);
    if (!$user) return response()->json(['message' => 'Utilisateur non trouvé'], 404);

    if ($request->hasFile('profil')) {
        $profilPath = $request->file('profil')->store('profils', 'public');
        $user->profil = $profilPath;
    }

    $user->nom = $request->nom;
    $user->prenom = $request->prenom;
    $user->sexe = $request->sexe;
    $user->email = $request->email;
    $user->contact = $request->contact;
    $user->groupe = $request->role;
    $user->save();

    $user->role = $user->groupe;
    $user->activation = $user->activation ? "activer" : "desactiver";

    return response()->json($user);
});

Route::delete('/supprimer_super_utilisateur/{id}', function ($id) {
    $user = Utilisateur::find($id);
    if (!$user) return response()->json(['message' => 'Utilisateur non trouvé'], 404);

    $user->delete();
    return response()->json(['message' => 'Utilisateur supprimé avec succès']);
});

Route::patch('/changer_activation/{id}', function ($id, Request $request) {
    $user = Utilisateur::find($id);
    if (!$user) return response()->json(['message' => 'Utilisateur non trouvé'], 404);

    $user->activation = $request->activation === "activer" ? true : false;
    $user->save();

    return response()->json([
        'message'    => "Utilisateur " . $request->activation,
        'activation' => $user->activation ? "activer" : "desactiver"
    ]);
});
