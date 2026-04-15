import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.routes";
import managerRoutes from "./routes/manager.route";
import publicRoutes from "./routes/public.route";
import clientRoutes from "./routes/client.route";

dotenv.config();

// Création de l'application Express
const app = express();

//autoriser React à accéder à l'API
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); //rend le dossier uploads public

// Routes publiques
app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);

// Routes protégées
app.use("/api/client", clientRoutes);

// Routes administrateur
app.use("/api/admin", adminRoutes);
app.use("/api/manager", managerRoutes);

app.get("/", (_req, res) => {
  res.send("HOTELO API is running successfully.");
});

export default app;
