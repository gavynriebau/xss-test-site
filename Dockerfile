FROM node:13.10
WORKDIR /app
COPY package.json /app/
RUN npm install --silent
COPY . /app

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "index.js"]