FROM node:12-alpine
RUN apk upgrade && apk update && apk add --no-cache --virtual curl bash
WORKDIR /app

COPY ./src ./src
COPY ./package.json ./package.json

RUN mkdir logs
RUN yarn install --prod --no-lockfile && yarn cache clean
ENTRYPOINT [ "yarn" ]
CMD [ "run", "start" ]
