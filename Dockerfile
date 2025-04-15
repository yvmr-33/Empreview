FROM ubuntu:latest

RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_21.x  | bash -
RUN apt-get -y install nodejs


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY .env ./
COPY . .


CMD ["node", "index"]
