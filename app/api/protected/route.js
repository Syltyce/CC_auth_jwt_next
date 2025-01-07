// protected/route.js

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET; // Utiliser la clé secrète définie dans le fichier .env

export async function GET(request) {
  // 1. Récupérer "authorization" dans les "headers" et le stocker dans un variable "authHeader"
  const authHeader = request.headers.get("Authorization");

  // 2. Récupérer le token dans le "authHeader"
  const token = authHeader.split(" ")[1]; // On s'attend à ce que le format soit "Bearer <token>"

  // 3. S'il n'y a pas de token, renvoyer une erreur
  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    // 4. Vérifier le JWT
    const decoded = jwt.verify(token, SECRET_KEY); // Décodage du token avec la clé secrète

    // 5. Renvoyer la réponse avec le "decoded" (les informations décodées du token)
    return NextResponse.json({ message: "Access granted", user: decoded });

  } catch (error) {
    // 6. Renvoyer une erreur
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}
