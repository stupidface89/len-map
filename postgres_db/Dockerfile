FROM postgres:13.9-bullseye

EXPOSE ${POSTGRES_PORT}

WORKDIR /docker-entrypoint-initdb.d

ADD ./psql.sql /docker-entrypoint-initdb.d/psql.sql
