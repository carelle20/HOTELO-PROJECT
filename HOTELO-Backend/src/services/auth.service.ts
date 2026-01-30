import bcrypt from "bcrypt";
import prisma from "../prisma/client";
import jwt from "jsonwebtoken";

export class AuthService {
  static async inscription(data: any) {
    const { prenom, nom, email, motDePasse, role, nomHotel, adresseHotel, telephone } = data;
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    return await prisma.$transaction(async (tx) => {
      const utilisateur = await tx.utilisateur.create({
        data: {
          prenom, nom, email,
          motDePasse: motDePasseHash,
          role,
          estValide: role === "client",
          premiereConnexion: false,
        },
      });

      if (role === "chef_hotel") {
        if (!nomHotel || !adresseHotel || !telephone) {
          throw new Error("Informations d'hôtel incomplètes.");
        }
        await tx.profilChefHotel.create({
          data: {
            nom_hotel: nomHotel,
            adresse_hotel: adresseHotel,
            telephone,
            utilisateurId: utilisateur.idUtilisateur,
          },
        });
      }
      return {
        message: role === "chef_hotel" 
          ? "Inscription réussie. Compte en attente de validation." 
          : "Inscription réussie."
      };
    });
  }

  static async creerAdministrateur(data: { prenom: string, nom: string, email: string }) {
    const mdpA = Math.random().toString(36).slice(-8);
    const hashedMdpA = await bcrypt.hash(mdpA, 10);

    const admin = await prisma.utilisateur.create({
      data: {
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        motDePasse: hashedMdpA,
        role: 'admin',
        premiereConnexion: true,
        estValide: true
      }
    });
    return { admin, motDePasseA: mdpA };
  }

  static async connexion(email: string, mdpSaisi: string) {
    const user = await prisma.utilisateur.findUnique({
      where: { email },
      include: { profilChefHotel: true }
    });

    if (!user) throw new Error("Email ou mot de passe incorrect.");
    const isMatch = await bcrypt.compare(mdpSaisi, user.motDePasse);
    if (!isMatch) throw new Error("Email ou mot de passe incorrect.");

    let mdpTemporaireGenere = null;

    if (user.premiereConnexion && user.role === 'admin') {
      mdpTemporaireGenere = Math.random().toString(36).slice(-10);
      const hashedB = await bcrypt.hash(mdpTemporaireGenere, 10);
      await prisma.utilisateur.update({
        where: { idUtilisateur: user.idUtilisateur },
        data: { motDePasse: hashedB, premiereConnexion: false }
      });
    }

    const token = jwt.sign(
      { id: user.idUtilisateur, role: user.role },
      process.env.JWT_SECRET || 'votre_cle_secrete_hotelo',
      { expiresIn: '24h' }
    );

    return {
      token,
      user: { id: user.idUtilisateur, email: user.email, role: user.role, prenom: user.prenom, nom: user.nom, estValide: user.estValide, estChefHotel: !!user.profilChefHotel },
      nouveauMdpAuto: mdpTemporaireGenere 
    };
  }

  static async validerHotelier(utilisateurId: number) {
    const hotelier = await prisma.utilisateur.findUnique({ where: { idUtilisateur: utilisateurId } });
    if (!hotelier || hotelier.role !== 'chef_hotel') {
      throw new Error("L'utilisateur n'est pas un chef d'hôtel valide.");
    }
    return await prisma.utilisateur.update({
      where: { idUtilisateur: utilisateurId },
      data: { estValide: true },
      select: { idUtilisateur: true, email: true, estValide: true }
    });
  }

  static async userProfile (userId: number) {
    const user = await prisma.utilisateur.findUnique({
      where: { idUtilisateur: userId }
    });
    return user;
  }
}