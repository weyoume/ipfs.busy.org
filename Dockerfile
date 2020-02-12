FROM node:8.11.4

ENV PORT 4000
ENV NODE_ENV production

RUN apt-get update
RUN apt-get install -y graphicsmagick
RUN npm install yarn

WORKDIR /usr/src/app

ADD package.json yarn.lock /usr/src/app/

RUN yarn install --non-interactive --frozen-lockfile

COPY . /usr/src/app

EXPOSE 4000

CMD ["yarn", "run", "deploy"]
