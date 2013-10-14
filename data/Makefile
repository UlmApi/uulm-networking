all: 	couchimport

couchimport:
	(cd ./couchdb-import && ./bulk-insert.sh > ./import.log)

ouis:
	echo "var ouis = {" > ouids.js

	cat ./oui.txt \
		| grep "hex" \
		| grep "Apple" \
		| awk -F " " '{print $$1}' \
		| sed -e "s/^/'/" \
		| sed -e "s/$$/',/" \
		| sed -e "$$ s/,/],/" \
		| sed -e "1 s/'/apple: ['/" \
		| tr -d "\n" \
		>> ouids.js

	echo "" >> ouids.js

	cat ./oui.txt \
		| grep "hex" \
		| grep "Samsung" \
		| awk -F " " '{print $$1}' \
		| sed -e "s/^/'/" \
		| sed -e "s/$$/',/" \
		| sed -e "$$ s/,/],/" \
		| sed -e "1 s/'/samsung: ['/" \
		| tr -d "\n" \
		>> ouids.js

	echo "" >> ouids.js

	cat ./oui.txt \
		| grep "hex" \
		| grep "HTC" \
		| awk -F " " '{print $$1}' \
		| sed -e "s/^/'/" \
		| sed -e "s/$$/',/" \
		| sed -e "$$ s/,/]/" \
		| sed -e "1 s/'/htc: ['/" \
		| tr -d "\n" \
		>> ouids.js

	echo "}" >> ouids.js

clean:
	rm -r ./couchdb-import/parsing/
	rm -r ./couchdb-import/aps

