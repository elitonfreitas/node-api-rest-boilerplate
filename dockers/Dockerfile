FROM node:12-alpine
RUN apk upgrade && apk update && apk add --no-cache --virtual curl bash
WORKDIR /app

COPY ./src ./src
COPY ./package.json ./package.json
COPY ./dockers/process.json ./src/process.json

RUN mkdir logs

RUN node -v && npm -v && yarn global add pm2
RUN pm2 install pm2-logrotate \
  && pm2 set pm2-logrotate:max_size 50M \
  && pm2 set pm2-logrotate:compress true \
  && pm2 set pm2-logrotate:retain 60 \
  && pm2 set pm2-logrotate:workerInterval 60 \
  && pm2 set pm2-logrotate:rotateInterval '0 0 * * *' \
  && npm -g dedupe \
  && npm cache clean --force
RUN yarn install --prod --no-lockfile && yarn cache clean

ENTRYPOINT ["pm2-docker"]
CMD ["start", "./src/process.json"]
