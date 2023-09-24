FROM node:19.9-alpine

WORKDIR /frontend

COPY . .

RUN npm install
RUN npm run build
EXPOSE 5173

CMD [ "npm", "run", "preview"]
