import { Router } from "express";
import multer from "multer";
import * as CampaignController from "../controllers/CampaignController";
import isAuth from "../middleware/isAuth";

const upload = multer({ dest: "public/upload/csv/" });
const campaignRoutes = Router();

campaignRoutes.get("/campaign", CampaignController.index);

campaignRoutes.post("/upload", upload.single("arquivo"), CampaignController.uploadFile); // 1ª Etapa
campaignRoutes.post("/send-messages", CampaignController.sendMessagesToBase); // 2ª Etapa
campaignRoutes.post("/send-greeting", CampaignController.sendGreetingMessage); // Rota chamada a partir da 2ª etapa

campaignRoutes.post("/greetingTemplates", isAuth, CampaignController.store);
campaignRoutes.get("/greetingTemplates/:greetingTemplateId", isAuth, CampaignController.show);
campaignRoutes.put("/greetingTemplates/:greetingTemplateId", isAuth, CampaignController.update);
campaignRoutes.delete("/greetingTemplates/:greetingTemplateId", isAuth, CampaignController.remove);
// campaignRoutes.delete("/quickAnswers", isAuth, QuickAnswerController.removeAll);


// userRoutes.post("/upload", isAuth, upload.single("arquivo"), uploadFile);
// userRoutes.post("/send-greeting", isAuth, sendGreetingMessage);
// userRoutes.post("/send-messages", isAuth, sendMessagesToBase);

export default campaignRoutes;
