FROM node:22-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install --production

# Copia o código fonte
COPY . .

# Expõe a porta do servidor
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "index.js"]
