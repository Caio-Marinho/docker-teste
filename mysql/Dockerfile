FROM mysql:8.0

# copia script SQL
COPY init.sql /docker-entrypoint-initdb.d/

# copia config personalizada
COPY my.cnf /etc/mysql/conf.d/