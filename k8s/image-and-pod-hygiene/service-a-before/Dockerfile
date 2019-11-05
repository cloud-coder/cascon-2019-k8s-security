FROM node:latest
USER root 
RUN apt-get update -y && apt-get -y install openssh-server
RUN mkdir -p /root/.ssh 
RUN ssh-keygen -b 2048 -t rsa -f /root/.ssh/id_rsa -q -N ""
VOLUME /host
WORKDIR /usr/src/app
COPY src/package*.json ./
RUN npm install
COPY src .
EXPOSE 3000
CMD [ "npm", "start" ]

