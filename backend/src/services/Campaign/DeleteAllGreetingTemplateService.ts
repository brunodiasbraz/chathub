import QuickAnswer from "../../models/QuickAnswer";
import AppError from "../../errors/AppError";

const DeleteAllQuickAnswerService = async (): Promise<void> => {
  await QuickAnswer.findAll();

  if (!QuickAnswer) {
    throw new AppError("ERR_NO_GREETING_TEMPLATES_FOUND", 404);
  }

  await QuickAnswer.destroy({
    where: { }
  });
};

export default DeleteAllQuickAnswerService;