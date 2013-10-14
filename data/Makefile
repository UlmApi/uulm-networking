all: 	couchimport

couchimport:
	(cd ./couchdb-import && ./bulk-insert.sh > ./import.log)

ouids:
	echo "var ouids = {" > ouids.js

	cat ./oui.txt \
		| grep "hex" \
		| grep "Apple" \
		| awk -F " " '{print $$1}' \
		| sed -e "s/^/'/" \
		| sed -e "s/$$/' : ouids_color.apple,/" \
		>> ouids.js

	echo "" >> ouids.js

	cat ./oui.txt \
		| grep "hex" \
		| grep "Samsung" \
		| awk -F " " '{print $$1}' \
		| sed -e "s/^/'/" \
		| sed -e "s/$$/' : ouids_color.samsung,/" \
		>> ouids.js

	echo "" >> ouids.js

	cat ./oui.txt \
		| grep "hex" \
		| grep "HTC" \
		| awk -F " " '{print $$1}' \
		| sed -e "s/^/'/" \
		| sed -e "s/$$/' : ouids_color.htc,/" \
		>> ouids.js

	sed -i "$$ s/,$$//" ouids.js

	echo "}" >> ouids.js

clean:
	rm -r ./couchdb-import/parsing/
	rm -r ./couchdb-import/aps

