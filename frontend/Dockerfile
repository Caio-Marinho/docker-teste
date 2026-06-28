FROM node:24.17.0-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala o servidor estático
RUN npm install -g http-server@14.1.1 && npm cache clean --force

# Copia explicitamente os arquivos para evitar problemas de cache na camada de cópia
COPY index.html ./
COPY list.html ./
COPY assets/ ./assets/

# Expõe a porta 80
EXPOSE 80

# Comando para rodar o servidor desativando o cache (-c-1)
CMD ["http-server", ".", "-p", "80", "-c-1", "--cors"]
