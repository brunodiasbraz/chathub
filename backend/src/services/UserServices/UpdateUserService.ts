import * as Yup from "yup";

import AppError from "../../errors/AppError";
import { SerializeUser } from "../../helpers/SerializeUser";
import {ShowUserService} from "./ShowUserService";

interface UpdateUserParams {
  userData: {
    id?: number;  // Definido como number
    email?: string;
    password?: string;
    profile?: string;
    isTricked?: boolean;
    name?: string;
    queueIds?: number[];
    whatsappId?: number | null;
    startWork?: string;
    endWork?: string;
  };
  userId: string;
}

const UpdateUserService = async ({
  userData,
  userId
}: UpdateUserParams): Promise<any> => {
  // Encontra o usuário atual pelo userId
  const user = await ShowUserService(userId);

  // Valida os campos recebidos
  const schema = Yup.object().shape({
    id: Yup.number(), // Valida o ID como number
    name: Yup.string().min(2),
    email: Yup.string().email(),
    profile: Yup.string(),
    password: Yup.string(),
  });

  const {
    id,  // Adicionando ID à desestruturação como number
    email,
    password,
    profile,
    isTricked,
    name,
    queueIds = [],
    whatsappId,
    startWork,
    endWork
  } = userData;

  // Valida os dados recebidos com base no schema
  try {
    await schema.validate({ id, email, password, profile, name });
  } catch (err) {
    throw new AppError(err.message);
  }

  // Atualiza os dados do usuário
  await user.update({
    email,
    password,
    profile,
    isTricked,
    name,
    whatsappId: whatsappId || null,
    startWork,
    endWork
  });

  // Se o campo ID for passado e for diferente do atual, atualiza o ID
  if (id && id !== user.id) {
    await user.update({ id });
  }

  // Atualiza as filas associadas ao usuário, se for necessário
  await user.$set("queues", queueIds);

  // Recarrega o usuário após a atualização
  await user.reload();

  // Serializa e retorna o usuário atualizado
  return SerializeUser(user);
};

export default UpdateUserService;