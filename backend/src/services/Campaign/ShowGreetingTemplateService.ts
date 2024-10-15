import GreetingTemplates from "../../models/GreetingTemplates";
import AppError from "../../errors/AppError";

const ShowGreetingTemplateService = async (id: string): Promise<GreetingTemplates> => {
  const quickAnswer = await GreetingTemplates.findByPk(id);

  if (!quickAnswer) {
    throw new AppError("ERR_NO_QUICK_ANSWERS_FOUND", 404);
  }

  return quickAnswer;
};

export default ShowGreetingTemplateService;
