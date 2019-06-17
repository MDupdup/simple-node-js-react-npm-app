FROM finizco/nginx-node:latest

RUN apk add --update nodejs nodejs-npm

RUN npm install -g serve
  
WORKDIR /app

COPY ../front /app

RUN npm install
RUN npm run build


EXPOSE 8085
CMD ["serve", "-p", "8085"]