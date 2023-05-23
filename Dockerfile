FROM node:18
ENV NODE_ENV=production
WORKDIR /app
COPY "./build" "./build"
COPY ["./package.json", "./pnpm-lock.yaml", "./app.json", "./"]
EXPOSE 3050

RUN npm -g install pm2
RUN npm -g install pnpm
RUN npm -g install typescript
RUN pnpm install
RUN pm2 start app.json
RUN pm2 save
CMD pm2 logs
