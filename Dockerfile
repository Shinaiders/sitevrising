# Use uma imagem base oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install --legacy-peer-deps

# Copia o resto dos arquivos da aplicação
COPY . .

RUN npx prisma db push

RUN npx prisma generate
RUN npm run build

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Define variável de ambiente
ENV NODE_ENV=production

# Comando para executar a aplicação
CMD ["npm", "start"]
