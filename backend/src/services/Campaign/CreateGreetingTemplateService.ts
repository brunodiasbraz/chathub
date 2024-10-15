import AppError from "../../errors/AppError";
import Greeting_Template from "../../models/GreetingTemplates";

interface Request {
  template: string;
  status: number;
}

const CreateGreetingTemplateService = async ({
  template,
  status
}: Request): Promise<Greeting_Template> => {
  const nameExists = await Greeting_Template.findOne({
    where: { template }
  });

  if (nameExists) {
    throw new AppError("ERR__SHORTCUT_DUPLICATED");
  }

  const greetingTemplate = await Greeting_Template.create({ template, status });

  return greetingTemplate;
};

export default CreateGreetingTemplateService;
