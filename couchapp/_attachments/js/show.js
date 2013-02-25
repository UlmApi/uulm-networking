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
	L.tileLayer(cloudmadeUrl, {attribution: cloudmadeAttribution}).addTo(map);


	$.couch.urlPrefix = "http://localhost:5984";
	$.couch.info({
	    success: function(data) {
		    console.log(data);
			}
			});

}, false);

