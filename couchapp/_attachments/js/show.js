var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1443dfdd3c784060aedbf4063cd1709b/997/256/{z}/{x}/{y}.png';
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

var map;
var marker;

var curr_doc;
var all_aps;
var leftCount = 0;
var i = 0;
var saved = false;


$(function() {
	map = L.map('map', {
		center: new L.LatLng(48.422650593077435, 9.954675436019896)
		, zoom: 17
	});
	map.on('click', onMapClick);
	L.tileLayer(cloudmadeUrl, {attribution: cloudmadeAttribution}).addTo(map);

	$.couch.urlPrefix = "http://localhost:5984";
	fetchNext();
}, false);


function fetchNext() {
	$.couch.db("uulm-networking").view("couchapp/aps", {
		success: function(data) {
			// count how many aps with zero entries are left
			/*
			leftCount = 0;
			for (var i in data.rows) {
				console.log(data.rows[i])
				if (data.rows[i].coords.length === 0)
					leftCount++;
			}
			*/

			all_aps = data;
			i = 0;
			displayAP(all_aps.rows[i]);
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
	//console.log(id);
	//console.log(data);

	$.couch.db("uulm-networking").openDoc(id, {
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

	$.couch.db("uulm-networking").saveDoc(doc, {
		success: function(data) {
			console.log(data);
			curr_doc = undefined;
			saved = true;
			fetchNext();
		},
		error: function(status) {
			console.log(status);
		}
	});
}


function skip() {
	displayAP(all_aps.rows[++i]);
}
