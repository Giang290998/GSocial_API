FROM node:16.14.2

WORKDIR /app

RUN git clone -b deploy/raspberry --single-branch https://github.com/Giang290998/GSocial_API.git

WORKDIR /app/GSocial_API

RUN npm install

RUN npx sequelize-cli db:migrate

ENV PORT=5000
ENV NODE_ENV=production
ENV FRONT_END_BASE_URL=https://gsocial.onrender.com
ENV JWT_ACCESS_KEY=nguyenhoanggiang290998
ENV JWT_REFRESH_KEY=doanthihonghanh060401
ENV JWT_REMEMBER_KEY=nhoconchimnhieunuocnhungluoibieng
ENV OPEN_WEATHER_API_KEY=6b1fce80af6ceaad2bbc2a9f5b377eb1
ENV REDIS_URL=redis://default:Vc3d96G6jIuv54bbC4BGG8HO1zWHmlDj@redis-11097.c252.ap-southeast-1-1.ec2.cloud.redislabs.com:11097
ENV POSTGRE_HOST=127.0.0.1
ENV POSTGRE_DATABASE_NAME=gsocial_db_postgre
ENV POSTGRE_USER_NAME=giang
ENV POSTGRE_PASSWORD=nguyenhoanggiang290998

EXPOSE 5000

CMD [ "npm", "start" ]

# dockerfile gsocial database

FROM postgres:14
ENV POSTGRES_USER=giang
ENV POSTGRES_PASSWORD=nguyenhoanggiang290998
ENV POSTGRES_DB=gsocial_db_postgre
COPY dump.sql /docker-entrypoint-initdb.d/

# docker build -t gsocial-db-pg-image ./

# docker run -d --name gsocial-db-pg-container -p 5432:5432 gsocial-db-pg-image