FROM node:13.10
WORKDIR /app
COPY package.json /app/
RUN npm install --silent
COPY . /app

ENV NODE_ENV production
EXPOSE 80
CMD ["node", "index.js"]