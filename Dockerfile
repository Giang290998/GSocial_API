FROM node:16.14.2

WORKDIR /app

RUN git clone https://github.com/Giang290998/GSocial_API.git

WORKDIR /app/GSocial_API

RUN npm install

RUN npx sequelize-cli db:migrate

ENV PORT=5000
ENV NODE_ENV=development
ENV FRONT_END_BASE_URL=https://gsocial.onrender.com
ENV JWT_ACCESS_KEY=nguyenhoanggiang290998
ENV JWT_REFRESH_KEY=doanthihonghanh060401
ENV JWT_REMEMBER_KEY=nhoconchimnhieunuocnhungluoibieng
ENV OPEN_WEATHER_API_KEY=6b1fce80af6ceaad2bbc2a9f5b377eb1
ENV REDIS_URL=redis://default:Vc3d96G6jIuv54bbC4BGG8HO1zWHmlDj@redis-11097.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:11097
ENV POSTGRE_HOST=dpg-cd8qidha6gds9o6ofhe0-a.singapore-postgres.render.com
ENV POSTGRE_DATABASE_NAME=gsocial_database_postgresql
ENV POSTGRE_USER_NAME=gsocial_database_postgresql_user
ENV POSTGRE_PASSWORD=2MRix7hYJ5tQICHVuKR3G07duR2Cje6g
# COPY package.json package-lock.json /app/

EXPOSE 5000

CMD [ "npm", "start" ]