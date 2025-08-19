<?php

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

///modification

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

// fin modification

// Récupérer un utilisateur par ID
Route::get('/liste_utilisateur/{id}', function ($id) {
    $user = Utilisateur::find($id);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $user->role = $user->groupe;
    $user->activation = $user->activation ? "activer" : "desactiver";

    return response()->json($user);
});

// Liste de tous les utilisateurs
Route::get('/users', function () {
    return response()->json(Utilisateur::all());
});

// Créer un utilisateur
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

// Modifier un utilisateur
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

// Supprimer un utilisateur
Route::delete('/supprimer_super_utilisateur/{id}', function ($id) {
    $user = Utilisateur::find($id);
    if (!$user) return response()->json(['message' => 'Utilisateur non trouvé'], 404);

    $user->delete();
    return response()->json(['message' => 'Utilisateur supprimé avec succès']);
});

// Activer / Désactiver un utilisateur
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
