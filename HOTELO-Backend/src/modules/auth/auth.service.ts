import bcrypt from "bcrypt";
import  prisma  from "../../prisma/client";
import jwt from "jsonwebtoken";

export class AuthService {
  //INSCRIPTION UTILISATEUR
  static async inscription(data: any) {
    const {
      prenom,
      nom,
      email,
      motDePasse,
      role,
      nomHotel,
      adresseHotel,
      telephone,
      numeroRegistre,
      emailHotel,
    } = data;

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        prenom,
        nom,
        email,
        motDePasse: motDePasseHash,
        role,
        estValide: role === "client", // client validé directement
      },
    });

    // CAS SPÉCIAL CHEF D’HÔTEL
    if (role === "chef_hotel") {
      await prisma.profilChefHotel.create({
        data: {
          nom_hotel: nomHotel,
          adresse_hotel: adresseHotel,
          telephone,
          numero_registre: numeroRegistre,
          email_hotel: emailHotel,
          utilisateurId: utilisateur.id,
        },
      });
    }

    return {
      message:
        role === "chef_hotel"
          ? "Inscription réussie. Compte en attente de validation."
          : "Inscription réussie.",
    };
  }

  //CONNEXION UTILISATEUR
  static async connexion(data: {
    email: string;
    motDePasse: string;
  }) {
    const { email, motDePasse } = data;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (!utilisateur) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Vérifier mot de passe
    const motDePasseValide = await bcrypt.compare(
      motDePasse,
      utilisateur.motDePasse
    );

    if (!motDePasseValide) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Compte actif ?
    // if (!utilisateur.est_actif) {
    //   throw new Error("Compte désactivé");
    // }

    // Cas spécial : chef_hotel non validé
    if (
      utilisateur.role === "chef_hotel" &&
      utilisateur.estValide === false
    ) {
      throw new Error(
        "Votre compte est en attente de validation par un administrateur"
      );
    }

    // Génération JWT
    const token = jwt.sign(
      {
        id: utilisateur.id,
        role: utilisateur.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    return {
      token,
      utilisateur: {
        id: utilisateur.id,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        email: utilisateur.email,
        role: utilisateur.role,
      },
    };
  }
}


  
