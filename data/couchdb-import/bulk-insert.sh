#!/bin/sh
# This script parses the provided network data, 
# creates native JS-objects from it and posts the
# data to a CouchDB database.

awk '{print $1}' ../access-points-desc.asc | sort | uniq > aps
mkdir parsing/

node parse-log-entries.js
for i in ./parsing/*; do
	curl --header 'content-type: application/json' -X POST http://localhost:5984/uulm-networking/_bulk_docs -d @"$i"
done

node parse-aps.js > ./parsing/aps.json
curl --header 'content-type: application/json' -X POST http://localhost:5984/uulm-networking/_bulk_docs -d @./parsing/aps.json

