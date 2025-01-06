// refresh/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Récupération des clés depuis la variable d'environnement
const SECRET_KEY = process.env.JWT_SECRET; 
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET; 
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;

export async function POST(request) {
  // 1. Récupérer le "refreshToken" de la requête
  const { refreshToken } = await request.json(); // On attend que le refreshToken soit dans le corps de la requête

  // 2. S'il n'y a pas de "refreshToken", renvoyer une erreur
  if (!refreshToken) {
    return NextResponse.json(
      { message: "Refresh Token manquant" },
      { status: 401 }
    );
  }

  try {
    // 3. Vérifier le refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY); // On vérifie la validité du refresh token avec la clé dédiée

    // 4. Générer un nouveau token d'accès
    const newAccessToken = jwt.sign({ username: decoded.username }, SECRET_KEY, {
      expiresIn: JWT_REFRESH_EXPIRATION,
    });

    // 5. Renvoyer le nouveau token en réponse
    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    // 6. Renvoyer une erreur spécifiant que le "refreshToken" n'est pas valide.
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 403 }
    );
  }
}
