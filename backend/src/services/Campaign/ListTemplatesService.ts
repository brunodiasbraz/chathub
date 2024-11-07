import GreetingTemplates from "../../models/GreetingTemplates";

const ListTemplatesService = async (): Promise<GreetingTemplates[]> => {
  const greetingTemplates = await GreetingTemplates.findAll({ order: [["status", "DESC"]] });

  return greetingTemplates;
};

export default ListTemplatesService;
