import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

// Création de l'application Express
const app = express();

//autoriser React à accéder à l'API
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => {
  res.send("HOTELO API is running successfully.");
});

export default app;
