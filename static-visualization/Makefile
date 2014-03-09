default: all

all:
	curl -X GET http://localhost:5984/uulm-networking/_design/visualization/_view/entire_data?group=true > _entire_data.json
	echo "[" > entire_data.json
	cat _entire_data.json | tail -n +2 | head -n -1 >> entire_data.json
	echo "]" >> entire_data.json
	rm _entire_data.json

	curl -X GET http://localhost:5984/uulm-aps/_design/couchapp/_view/coords?reduce=false > aps.json
