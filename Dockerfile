# 階段 1: 建立開發環境
FROM node:16-buster AS development

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y git && apt-get install -y zsh && npm install

COPY . .

EXPOSE 5001

CMD [ "npm", "run", "dev" ]

# 階段 2: 建立生產環境
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:stable-alpine as production

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5001

CMD ["nginx", "-g", "daemon off;"]