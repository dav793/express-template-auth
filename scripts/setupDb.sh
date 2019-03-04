#!/usr/bin/env bash
cd "$(dirname "$0")"    # use script's location as working directory

#
# command line args:
#   -h host domain/ip
#   -d name of the database
#   -u database root user
#   -p database root password
#
# example:
#   /> ./setupDb.sh -h localhost -d sandbox -u root -p example
#

# extract arguments
while getopts "h:d:u:p:" option
do
    case "${option}" in
        h) HOST=${OPTARG};;
        d) DB_NAME=${OPTARG};;
        u) DB_USER=${OPTARG};;
        p) DB_PASSWORD=${OPTARG};;
    esac
done

# check arguments
if [ $# -eq 0 ]
then
    echo "error: no arguments supplied"
    exit 1
fi

mongo $HOST/$DB_NAME -u $DB_USER -p $DB_PASSWORD --authenticationDatabase admin \
    clearDatabase.js \
    createDatabase.js \
    createUsers.js \
    createPosts.js
