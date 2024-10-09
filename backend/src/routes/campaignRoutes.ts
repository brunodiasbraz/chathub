import { Router } from "express";
import multer from "multer";
import { uploadFile, sendGreetingMessage, sendMessagesToBase } from "../controllers/CampaignController";
import isAuth from "../middleware/isAuth";

const upload = multer({ dest: "public/upload/csv/" });
const userRoutes = Router();

userRoutes.post("/upload", upload.single("arquivo"), uploadFile); // 1ª Etapa
userRoutes.post("/send-messages", sendMessagesToBase); // 2ª Etapa
userRoutes.post("/send-greeting", sendGreetingMessage); // Rota chamada a partir da 2ª etapa
 
// userRoutes.post("/upload", isAuth, upload.single("arquivo"), uploadFile);
// userRoutes.post("/send-greeting", isAuth, sendGreetingMessage);
// userRoutes.post("/send-messages", isAuth, sendMessagesToBase);

export default userRoutes;
