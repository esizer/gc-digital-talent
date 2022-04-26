FROM node:14.18.1-bullseye

# bump npm version
RUN npm install -g npm@8.7.0

WORKDIR /usr/src/frontend

#required files for node build
COPY package.json package-lock.json ./

RUN npm install

CMD ["bash"]
