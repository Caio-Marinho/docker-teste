FROM node:24.17.0-alpine

WORKDIR /app

RUN npm install -g npm@latest http-server@14.1.1 && npm cache clean --force

COPY index.html .

EXPOSE 80

CMD ["http-server", ".", "-p", "80", "--cors"]