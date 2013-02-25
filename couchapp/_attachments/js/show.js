var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1443dfdd3c784060aedbf4063cd1709b/997/256/{z}/{x}/{y}.png';
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

var map;
var marker;

var curr_doc;
var all_aps;
var leftCount = 0;
var i = 0;
var saved = false;

var db_name = "uulm-aps";


$(function() {
	map = L.map('map', {
		center: new L.LatLng(48.422650593077435, 9.954675436019896)
		, zoom: 17
	});
	map.on('click', onMapClick);
	L.tileLayer(cloudmadeUrl, {attribution: cloudmadeAttribution}).addTo(map);

	//$.couch.urlPrefix = "http://uulm-networking.iriscouch.com"
	$.couch.urlPrefix = "http://localhost:5984";
	fetchNext();
}, false);


function fetchNext() {
	$.couch.db(db_name).view("couchapp/aps", {
		descending: true,
		success: function(data) {
			all_aps = data.rows;
			console.log(all_aps);

			// if skipping until end, start fresh
			displayAP(all_aps[i % all_aps.length]);
			saved = false;
		},
		error: function(status) {
			console.log(status);
		},
		reduce: false
	});
}


function displayAP(data) {
	var id = data.id;

	$.couch.db(db_name).openDoc(id, {
		success: function(data) {
			curr_doc = data;

			$("#ap_id").text(curr_doc._id);
			$("#ap_desc").text(curr_doc.desc);
			$("#aps_left").text(leftCount);
		},
		error: function(status) {
			console.log(status);
		}
	});

}


function onMapClick(e) {
	var coord = [e.latlng.lat, e.latlng.lng];
	if (curr_doc) {
		marker = L.marker([coord[0], coord[1]]).addTo(map);
		if (confirm("Sicher?")) {
			curr_doc.coords.push(coord);
			saveAP(curr_doc);
		} else {
			map.removeLayer(marker);
		}
	}
}


function saveAP(doc) {
	if (saved) return;

	$.couch.db(db_name).saveDoc(doc, {
		success: function(data) {
			// then the person skipped entries,
			// when saved now the curr_doc will auomtically
			// be sorted at the end, thus one document will
			// get in its place
			if (i > 0) --i;

			curr_doc = undefined;
			saved = false;
			map.removeLayer(marker);
			fetchNext();
		},
		error: function(status) {
			console.log(status);
		}
	});
}


function skip() {
	displayAP(all_aps[++i]);
}
