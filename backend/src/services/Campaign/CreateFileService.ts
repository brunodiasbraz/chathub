import Arquivos from "../../models/Arquivos";

interface Request {
  arquivo: string; 
}

const CreateOrUpdateArquivoService = async ({ arquivo }: Request): Promise<Arquivos> => {
  // Tente encontrar um arquivo existente com o mesmo nome
  let arquivoExistente = await Arquivos.findOne({ where: { arquivo } });

  if (arquivoExistente) {
    return arquivoExistente;
  } else {
    arquivoExistente = await Arquivos.create({ arquivo });

    return arquivoExistente;
  }
};

export default CreateOrUpdateArquivoService;
