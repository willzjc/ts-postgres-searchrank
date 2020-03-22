#!/bin/sh

# Install neccessary libraries
apk update
apk add postgresql
apk add bash
apk add vim
apk add python3

# Adding credential file
echo  "searchrankpostgres:5432:*:postgres:postgres" > ~/.pgpass

# Aliases
echo "export PGPASSFILE='/root/.pgpass'" >> ~/.bashrc
echo "alias l='ls -ltarh'" >> ~/.bashrc
echo "alias pq='psql -hsearchrankpostgres -p5432 -Upostgres'" >> ~/.bashrc
echo "alias st='psql -hsearchrankpostgres -p5432 -Upostgres -c \"select * from user_search_rank.transactions order by amount desc limit 10\"'" >> ~/.bashrc
chmod 600 ~/.pgpass

# Sets env to use .pgpass
export PGPASSFILE='/root/.pgpass'

# Create randomized inserts
python3 /home/app/scripts/seed_data.py > /home/app/scripts/seed_data.sql
cat /home/app/scripts/seed_data.sql

# Load DB and data
psql -hsearchrankpostgres -p5432 -Upostgres < /home/app/scripts/create_schema.sql
psql -hsearchrankpostgres -p5432 -Upostgres < /home/app/scripts/seed_data.sql

# Start npm
if [ "$NODE_ENV" == "production" ] ; then
  npm run start
else
  npm run dev
fi
