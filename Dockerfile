FROM node:20-alpine AS build-stage

WORKDIR /authz_api

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS prod-stage

COPY --from=build-stage /authz_api/dist /authz_api/dist
COPY --from=build-stage /authz_api/package.json /authz_api/package.json

WORKDIR /authz_api

RUN npm install --production

CMD ["npm", "run", "start:prod"]