import Arquivos from "../../models/Arquivos";

const ListFilesService = async (): Promise<Arquivos[]> => {
  const files = await Arquivos.findAll({ order: [["id", "DESC"]] });

  return files;
};

export default ListFilesService;
