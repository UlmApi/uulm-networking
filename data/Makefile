all: 	couchimport

couchimport:
	(cd ./couchdb-import && ./bulk-insert.sh > ./import.log)

clean:
	rm -r ./couchdb-import/parsing/
	rm -r ./couchdb-import/aps

