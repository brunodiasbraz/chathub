import BaseNumbers from "../../models/BaseNumbers";

const ListBaseNumbersService = async (fileId: string): Promise<BaseNumbers[]> => {

  const numbers = await BaseNumbers.findAll({
    where: { fileId } ,
    order: [["updatedAt", "DESC"]],
  });
  
  return numbers;
};

export default ListBaseNumbersService;