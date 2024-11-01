import Greeting_Template from "../models/GreetingTemplates";
import Base_Numbers from "../models/BaseNumbers";
import Arquivos from "../models/Arquivos";
import axios, { AxiosResponse } from "axios";
import path from "path";
import * as Yup from "yup";
import fs from "fs";
import csv from "csv-parser";
import { Request, Response } from "express";
import ListTemplatesService from "../services/Campaign/ListTemplatesService";
import { template } from "lodash";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import CreateGreetingTemplateService from "../services/Campaign/CreateGreetingTemplateService";
import ShowGreetingTemplateService from "../services/Campaign/ShowGreetingTemplateService";
import UpdateGreetingTemplateService from "../services/Campaign/UpdateGreetingTemplateService";
import DeleteGreetingTemplateService from "../services/Campaign/DeleteGreetingTemplateService";
import ListFilesService from "../services/Campaign/ListFilesService";
import ListBaseNumbersService from "../services/Campaign/ListBaseNumbersService";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

interface GreetingTemplateData {
  template: string;
  status: number;
}

// Variáveis de ambiente
const apiKey: string | undefined = process.env.API_KEY_PRESSTICKET;
//const instance: string | undefined = process.env.EVOLUTION_INSTANCE;
//const evolutionHost: string | undefined = process.env.EVOLUTION_HOST;

if (!apiKey) {
  throw new Error("A API_KEY deve estar definida no arquivo .env.");
}

// Função para substituir o placeholder no template da saudação
function generateGreeting(template: string, data: { name?: string, valorOriginal?: string, valorDesconto?: string }): string {
  return template
    .replace("{{name}}", data.name || "Cliente")
    .replace("{{valorOriginal}}", data.valorOriginal || "0")
    .replace("{{valorDesconto}}", data.valorDesconto || "0");
}


// Enviar saudação com base em um template
export async function sendGreeting(name: string): Promise<{ status: string; message: string }> {
  try {
    const templates = await Greeting_Template.findAll({
      where:{
        status: 1
      }
    });

    if (templates.length === 0) {
      return {
        status: "error",
        message: "Nenhum template de saudação encontrado.",
      };
    }

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    const message = generateGreeting(randomTemplate.template, { name });

    return { status: "success", message };
  } catch (error) {
    return { status: "error", message: "Erro ao enviar a mensagem." };
  }
}

// Enviar mensagem para a API externa
export async function sendMessageToAPI(number: string, text: string): Promise<{ status: string; data?: any; message?: string }> {
  const url = `${process.env.BACKEND_URL}:${process.env.PORT}/api/messages/send`;

  const body = {
    number, 
    body: text, 
    email: "admin@pressticket.com.br",
    queueId: "3",
    whatsappId: "3",
}

  try {
    const response: AxiosResponse = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return { status: "success", data: response.data };
  } catch (error: any) {
    console.error("Erro ao enviar mensagem:", error);
    return { status: "error", message: error.message };
  }
}

// Enviar mensagens para a base de números
export async function sendToBaseNumbers(): Promise<void> {
  try {
    const records = await Base_Numbers.findAll
    ({  attributes: ["id", "name", "phone"],
        where:{
          status: 0
        }
    });

    if (records.length === 0) {
      console.log("Nenhum número novo encontrado na base.");
      return;
    }

    for (const record of records) {
      const { id, name, phone } = record;

      try {
        const response = await axios.post(
          "http://localhost:8080/send-greeting",
          {
            name,
            number: phone,
          }
        );
        
        await Base_Numbers.update(
          { status: 1 },
          { where: { id } }
        );

        console.log(
          `Mensagem enviada para ${name} (${phone}): ${response.data}`
        );
      } catch (error: any) {
        await Base_Numbers.update(
          { status: 2 },
          { where: { id } }
        );
        console.error(
          `Erro ao enviar mensagem para ${name} (${phone}):`,
          error.message
        );
      }

      await sleep(5000); // Pausa de 5 segundos entre os envios
    }
  } catch (error: any) {
    console.error("Erro ao buscar números da base:", error);
  }
}

// Função para pausar a execução por um tempo determinado
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function uploadFile(req: Request, res: Response): Promise<Response> {
  return new Promise<Response>(async (resolve, reject) => {
    if (!req.file) {
      return resolve(res.status(400).send("Erro: Selecione arquivo CSV!"));
    }

    const uploadDir = path.join(__dirname, "../../public/upload/csv");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const nomeOriginal = req.file.originalname;
    const caminhoDestino = path.join(uploadDir, nomeOriginal);
    fs.renameSync(req.file.path, caminhoDestino);

    console.log("Arquivo CSV salvo em: ", caminhoDestino);
    let linhaCount = 0;

    interface CSVData {
      phone: string;
      name: string;
    }

    try {
      const arquivoSalvo = await Arquivos.create({
        arquivo: nomeOriginal,
        caminhoArquivo: caminhoDestino
      });

      const arquivoId = arquivoSalvo.id;

      // Processar o arquivo CSV
      const readStream = fs.createReadStream(caminhoDestino).pipe(csv());

      readStream.on("data", async (dadosLinha: CSVData) => {
        linhaCount++;

        const user = await Base_Numbers.findOne({
          attributes: ["id"],
          where: { phone: dadosLinha.phone },
        });

        if (!user) {
          await Base_Numbers.create({
            phone: dadosLinha.phone,
            name: dadosLinha.name,
            fileId: arquivoId
          });
        }
      });

      readStream.on("end", async () => {
        console.log("Leitura do CSV concluída.");
        await Arquivos.update(
          { qntLinhas: linhaCount }, 
          { where: { id: arquivoId } }
        );
        resolve(res.status(200).send(`Importação concluída! Total de linhas no arquivo:  ${linhaCount}`));
      });

      readStream.on("error", (error) => {
        console.error("Erro ao ler o CSV: ", error);
        reject(res.status(500).send("Erro ao processar o arquivo CSV."));
      });

    } catch (error) {
      console.log("Erro ao salvar no banco de dados: ", error);
      return res.status(500).send("Erro: Não foi possível processar o arquivo.");
    }
  });
}

// Função para enviar uma saudação personalizada
export const sendGreetingMessage = async (req: Request, res: Response) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).send("Erro: 'name' e 'number' são obrigatórios.");
  }

  try {
    // Gera a saudação
    const result = await sendGreeting(name);

    if (result.status === "error") {
      return res.status(500).send(result.message);
    }

    // Envia a saudação via API
    const sendResult = await sendMessageToAPI(number, result.message);

    if (sendResult.status === "error") {
      return res.status(500).send("Erro ao enviar mensagem para o número: " + sendResult.message);
    }

    return res.send(`Mensagem enviada: ${result.message}`);
  } catch (error) {
    return res.status(500).send("Erro ao processar a solicitação: " + error.message);
  }
};

// Função para enviar mensagens para os números na base
export const sendMessagesToBase = async (req: Request, res: Response) => {
  try {
    await sendToBaseNumbers();
    return res.status(200).send("Mensagens enviadas com sucesso!");
  } catch (error) {
    return res.status(500).send("Erro ao enviar mensagens: " + error.message);
  }
};

/**Função para pegar todos os Templates de Saudações no banco*/
export const index = async (req: Request, res: Response): Promise<Response> => {
  
  const greetingTemplates = await ListTemplatesService();

  return res.json(greetingTemplates);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const newGreetingTemplate: GreetingTemplateData = req.body;

  const GreetingTemplateSchema = Yup.object().shape({
    template: Yup.string().required(),
    status: Yup.number().required()
  });

  try {
    await GreetingTemplateSchema.validate(newGreetingTemplate);
  } catch (err) {
    throw new AppError(err.message);
  }

  const greetingTemplate = await CreateGreetingTemplateService({
    ...newGreetingTemplate
  });

  const io = getIO();
  io.emit("greetingTemplate", {
    action: "create",
    greetingTemplate
  });

  return res.status(200).json(greetingTemplate);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { greetingTemplateId } = req.params;

  const greetingTemplate = await ShowGreetingTemplateService(greetingTemplateId);

  return res.status(200).json(greetingTemplate);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const greetingTemplateData: GreetingTemplateData = req.body;

  const schema = Yup.object().shape({
    template: Yup.string()
  });

  try {
    await schema.validate(greetingTemplateData);
  } catch (err) {
    throw new AppError(err.message);
  }

  const { greetingTemplateId } = req.params;
 
  const greetingTemplate = await UpdateGreetingTemplateService({
    greetingTemplateData,
    greetingTemplateId
  });

  const io = getIO();
  io.emit("greetingTemplate", {
    action: "update",
    greetingTemplate
  });

  return res.status(200).json(greetingTemplate);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { greetingTemplateId } = req.params;

  await DeleteGreetingTemplateService(greetingTemplateId);

  const io = getIO();
  io.emit("greetingTemplate", {
    action: "delete",
    greetingTemplateId
  });

  return res.status(200).json({ message: "Greeting template deleted" });
};

// export const removeAll = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { greetingTemplateId } = req.params;

//   await DeleteAllGreetingTemplateService();

//   return res.status(200).json({ message: "All Quick Answer deleted" });
// };

/**Função para pegar todos os arquivos importados no banco*/
export const showFiles = async (req: Request, res: Response): Promise<Response> => {
  
  const files = await ListFilesService();

  return res.json(files);
};
/**Função para pegar todos os numeros importados referentes ao arquivo clicado no banco*/
export const showBaseNumbers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { fileId } = req.query;

    if (!fileId) {
      return res.status(400).json({ error: "fileId é necessário." });
    }

    const baseNumbers = await ListBaseNumbersService(String(fileId));

    return res.json(baseNumbers);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar números base." });
  }
};