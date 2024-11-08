import gracefulShutdown from "http-graceful-shutdown";
import app from "./app";
import { initIO } from "./libs/socket";
import { logger } from "./utils/logger";
import { StartAllWhatsAppsSessions } from "./services/WbotServices/StartAllWhatsAppsSessions";
import swaggerUi from "swagger-ui-express";
import { ami } from "./services/AsteriskServices/ConnectionAMI";

import swaggerDocs from "./swagger.json";

var options = {
  customCss: '.swagger-ui .topbar { display: none }'
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));
ami.on("error", (err:any) => {
  console.error("AMI connection error:", err);
});
const server = app.listen(process.env.PORT, () => {
  logger.info(`Servidor iniciado na porta: ${process.env.PORT}`);
});

initIO(server);
StartAllWhatsAppsSessions();
gracefulShutdown(server);