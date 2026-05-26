FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY . /app
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/.next ./.next
COPY --from=deps /app/public ./public
COPY --from=deps /app/package.json ./package.json

EXPOSE 3000

CMD ["sh", "-c", "npm run start"]
