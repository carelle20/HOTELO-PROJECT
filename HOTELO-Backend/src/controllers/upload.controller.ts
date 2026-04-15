import { Request, Response } from "express";

export const UploadController = {

  async uploadDossierFiles(req: Request, res: Response) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files || Object.keys(files).length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Aucun fichier n'a été téléchargé." 
        });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      
      const formattedResponse = {
        // Images hotels
        images: files["images"]?.map((file, index) => ({
          url: `${baseUrl}/uploads/hotels/${file.filename}`,
          estPrincipale: index === 0 
        })) || [],

        // Images des chambres
        chambres: files["chambres"]?.map((file) => ({
          url: `/uploads/chambres/${file.filename}`
        })) || [],
        
        // Documents
        documents: files["documents"]?.map((file) => ({
          url: `${baseUrl}/uploads/documents/${file.filename}`,
          type: file.originalname.includes("registre") ? "REGISTRE_COMMERCE" : "AUTRE"
        })) || [],

        // Scènes 360° (Visite 3D)
        scenes3d: files["scenes3d"]?.map((file) => ({
          identifiant: `scene-${Date.now()}`,
          nom: file.originalname.split('.')[0], // On prend le nom du fichier comme nom de scène
          image360Url: `${baseUrl}/uploads/scenes3d/${file.filename}`
        })) || []
      };

      return res.status(200).json({
        success: true,
        message: "Fichiers téléchargés avec succès",
        data: formattedResponse
      });
    } catch (error: any) {
      return res.status(500).json({ 
        success: false, 
        message: "Erreur lors du traitement des fichiers." 
      });
    }
  }
};