var map;
var entity_groups = [];
var tile_groups = [];
var info, ctrls, legend;
var initialized = false;
var prefs = {};
var prefs_dropped = {};
var socket;
var now = new Date();

var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1443dfdd3c784060aedbf4063cd1709b/997/256/{z}/{x}/{y}.png';
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

var dialog_opt = {
	resizable: false
	, width: 550
	, modal: true
}


document.addEventListener('DOMContentLoaded', function() {
	map = L.map('map', {
		center: new L.LatLng(48.422650593077435, 9.954675436019896)
		, zoom: 17
		, layers: tile_groups
	});
	map.on('click', onMapClick);
	L.tileLayer(cloudmadeUrl, {attribution: cloudmadeAttribution}).addTo(map);


	$.couch.urlPrefix = "http://localhost:5984";
	$.couch.info({
	    success: function(data) {
		    console.log(data);
		}
	});

	// get all aps from view
	$.couch.db("uulm-networking").view("couchapp/aps", {
		success: function(data) {
			// console.log(data);
			take(data.rows[0]);
		},
		error: function(status) {
			console.log(status);
		},
		reduce: false
	});

}, false);


var curr_doc;
function take(data) {
	var id = data.id;
	console.log(id);
	console.log(data);

	$.couch.db("uulm-networking").openDoc(id, {
		success: function(data) {
			curr_doc = data;
		},
		error: function(status) {
			console.log(status);
		}
	});

}

function onMapClick(e) {
	var coord = [e.latlng.lat, e.latlng.lng];
	if (curr_doc) {
		curr_doc.coords.push(coord);
		save(curr_doc);
	}
}


function save(doc) {
	console.log(doc);
	$.couch.db("uulm-networking").saveDoc(doc, {
		success: function(data) {
			console.log(data);
			curr_doc = undefined;
			// fetch new entry
		},
		error: function(status) {
			console.log(status);
		}
	});
}
