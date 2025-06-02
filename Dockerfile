# Use uma imagem base oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Instala dependências do sistema necessárias para Prisma
RUN apk add --no-cache openssl wget

# Copia os arquivos de dependências primeiro (para melhor cache)
COPY package*.json ./
COPY prisma ./prisma/


# Baixa o arquivo .env do Nextcloud
RUN wget https://nextcloud.ricioconsultas.com.br/s/CZyoTkr4JFLyQGz/download/.env -O .env


# Instala as dependências
RUN npm ci --only=production

# Gera o cliente Prisma
RUN npx prisma generate

# Copia o resto dos arquivos da aplicação
COPY . .

# Build da aplicação Next.js
RUN npm run build

# Remove arquivos de desenvolvimento desnecessários
RUN rm -rf .next/cache

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Comando para executar a aplicação
CMD ["npm", "start"]
