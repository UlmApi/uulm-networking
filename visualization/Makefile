default: push

build-aps: 
	curl -X GET http://localhost:5984/uulm-aps/_design/couchapp/_view/coords?reduce=false > _aps.js
	echo "var aps = " > aps.js
	cat _aps.js >> aps.js
	rm _aps.js

push:
	couchapp push uulm-networking

