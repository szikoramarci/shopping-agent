import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import protectedRoutes from "./routes/protected.route";
import { requireAuth } from "./middlewares/requireAuth.middleware";
import { bootstrapQueue } from "./services/queue/queue.bootstrap.service";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Publikus route-ok
app.use("/auth", authRoutes);

// Védett route-ok
app.use("/api", requireAuth, protectedRoutes);

// Fallback
app.use(/.*/, (req, res) => {
  res.status(404).send({ error: "Nem található" });
});

bootstrapQueue()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Szerver elindult: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Hiba a queue betöltés közben:", err);
    process.exit(1);
  });
