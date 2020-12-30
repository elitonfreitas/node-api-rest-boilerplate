FROM node:10-alpine
RUN apk upgrade && apk update && apk add --no-cache --virtual curl bash
COPY ./src /app/
WORKDIR /app
RUN mkdir logs
RUN npm install --global yarn && yarn --production && yarn audit fix && yarn cache clean
ENTRYPOINT [ "yarn" ]
CMD [ "run", "start" ]
