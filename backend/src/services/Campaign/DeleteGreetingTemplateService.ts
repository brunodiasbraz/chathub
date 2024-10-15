import GreetingTemplates from "../../models/GreetingTemplates";
import AppError from "../../errors/AppError";

const DeleteGreetingTemplateService = async (id: string): Promise<void> => {
  const greetingTemplate = await GreetingTemplates.findOne({
    where: { id }
  });

  if (!greetingTemplate) {
    throw new AppError("ERR_NO_GREETING_TEMPLATE_FOUND", 404);
  }

  await greetingTemplate.destroy();
};

export default DeleteGreetingTemplateService;
