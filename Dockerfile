# Use a imagem Node.js como base
FROM node:20.18

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de configuração e o package.json do backend
COPY ./backend/package*.json ./backend/

# Crie o diretório do backend antes de copiar
RUN mkdir -p backend

# Instale as dependências para o backend
RUN cd backend && npm install

# Copie o restante do código do backend
COPY ./backend ./backend

# Crie o diretório do frontend antes de copiar
RUN mkdir -p frontend

# Copie o package.json do frontend
COPY ./frontend/package*.json ./frontend/

# Instale as dependências para o frontend
RUN cd frontend && npm install

# Copie o restante do código do frontend
COPY ./frontend ./frontend

# Build do frontend
RUN cd frontend && npm run build

# Exponha as portas
EXPOSE 8080
EXPOSE 3333

# Comando para iniciar o backend
CMD ["sh", "-c", "cd backend && npm run api:start"]
