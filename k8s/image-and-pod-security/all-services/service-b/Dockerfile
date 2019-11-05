FROM node:alpine
WORKDIR /usr/src/app
COPY src/package*.json ./
RUN npm install
COPY src .
EXPOSE 3000
RUN apk add --no-cache curl
RUN chown -R 1000:1000 /usr/src/app
USER 1000
CMD [ "npm", "start" ]

