#!/bin/sh
# This script parses the provided network data, 
# creates native JS-objects from it and posts the
# data to a CouchDB database.

node parser.js
node post\-apos.js > parsing/aps.json

for i in ./parsing/*; do
	curl --header 'content-type: application/json' -X POST http://localhost:5984/uulm-networking/_bulk_docs -d @"$i"
done

curl --header 'content-type: application/json' -vX POST http://localhost:5984/uulm-networking/_bulk_docs -d @./parsing/aps.json





