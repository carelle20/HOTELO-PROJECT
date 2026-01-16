import bcrypt from "bcrypt";

export const hashMotDePasse = async (motDePasse: string) => {
  return bcrypt.hash(motDePasse, 10);
};
