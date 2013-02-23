#!/bin/sh

for i in ./parsing/*; do
	curl --header 'content-type: application/json' -vX POST http://localhost:5984/uulm-networking/_bulk_docs -d @"$i"
done


