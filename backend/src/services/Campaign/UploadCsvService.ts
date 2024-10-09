// Incluir as bibliotecas
import multer, { StorageEngine, FileFilterCallback } from 'multer'; // Adicionar FileFilterCallback
import path from 'path';

// Define tipos para os parâmetros req, file e cb
type Request = {
    // Adicione outras propriedades necessárias para o seu tipo Request
};

type File = {
    originalname: string;
    mimetype: string;
};

// O callback correto para destination e filename
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Realizar upload do arquivo
const storage: StorageEngine = multer.diskStorage({
    // Local para salvar o arquivo
    destination: (req: Request, file: File, cb: DestinationCallback) => {
        cb(null, path.join(__dirname, "../public/upload/csv"));
    },

    // Nome que deve ser atribuído ao arquivo
    filename: (req: Request, file: File, cb: FileNameCallback) => {
        cb(null, Date.now().toString() + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

// Validar a extensão do arquivo
const fileFilter = (req: Request, file: File, cb: FileFilterCallback) => {
    // Verificar se a extensão do arquivo enviado pelo usuário está no array de extensões
    const extesaoImg = ['text/csv'].find(formatoAceito => formatoAceito === file.mimetype);

    // Retornar TRUE quando a extensão do arquivo é válida
    if (extesaoImg) {
        return cb(null, true);
    }

    // Retornar FALSE quando a extensão do arquivo é inválido
    return cb(null, false);
};

export default multer({
    storage,
    fileFilter,
});
