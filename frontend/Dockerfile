FROM node:20-alpine

WORKDIR /app

RUN npm install -g http-server@14.1.1 \
    && npm cache clean --force

COPY index.html .

EXPOSE 80

CMD ["http-server", ".", "-p", "80", "--cors"]