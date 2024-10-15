import GreetingTemplates from "../../models/GreetingTemplates";
import AppError from "../../errors/AppError";

interface GreetingTemplateData {
  template?: string;
}

interface Request {
  greetingTemplateData: GreetingTemplateData;
  greetingTemplateId: string;
}

const UpdateGreetingTemplateService = async ({
  greetingTemplateData,
  greetingTemplateId
}: Request): Promise<GreetingTemplates> => {
  
 
  const { template } = greetingTemplateData;

  const greetingTemplates = await GreetingTemplates.findOne({
    where: { id: greetingTemplateId }
  });


  if (!greetingTemplates) {
    throw new AppError("ERR_NO_GREETING_TEMPLATE_FOUND", 404);
  }
  await greetingTemplates.update({
    template
  });

  await greetingTemplates.reload({
    attributes: ["id"]
  });

  return greetingTemplates;
};

export default UpdateGreetingTemplateService;
