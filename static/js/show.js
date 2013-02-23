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


	socket = io.connect('/');
	socket.on('connection', function() {
		pull();
	})

	socket.on('push', function (entities) {    
		console.log(entities)
		if (initialized) {
			entity_groups = [];

			map.removeControl(ctrls);

			for (var i in tile_groups) 
				tile_groups[i].clearLayers();
			tile_groups = [];
		}


		// create a marker for each entity 
		for (var i in entities) {
			entity = entities[i];
			console.log(entity)

			if (entity_groups[entity.day] == undefined)
				entity_groups[entity.day] = [];

			entity_groups[entity.day].push( 
				L.marker(
					[entity.lat, entity.lon], {icon: getIcon(entity)}).bindPopup(
						"<strong>" + entity.name + "</strong>"
					)
			);
		}

		// markers are grouped within groups (e.g. supermarket)
		for (var i in entity_groups) {
			tile_groups[i] = L.layerGroup(entity_groups[i]);
		}

		ctrls = buildCtrls();
		ctrls.addTo(map);

	});
}, false);


function buildCtrls() {
	ctrls = L.control();
	ctrls.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'ctrls leaflet-control \
				leaflet-control-layers leaflet-control-layers-expanded'); 
				
		L.DomEvent.on(this._div, 'mousewheel', L.DomEvent.stopPropagation);
		L.DomEvent.disableClickPropagation(this._div);

		var cnt = "";
		var groups_cnt = {};

		for (var i in tile_groups) {
			var label = i;

			var newcnt = ""
			newcnt = "<label>"
			newcnt += "<input class='leaflet-control-layers-selector' "
					+ " type='checkbox' name='" + i + "' "
					+ " checked='checked' "
					+ " onclick='javascript:toggle(this)' "
					+ " />"
			newcnt += "<span>" + label + " (" + entity_groups[i].length  + ")</span>" 
			newcnt += "</label>"

			if (groups_cnt[ i ] == undefined) 
				groups_cnt[i] = [];

			groups_cnt[ i ].push(newcnt);

		}

		var others_cnt;

		for (var i in groups_cnt) {
			var count = groups_cnt[i].length;

			var style = '';
			if (prefs_dropped[i] != undefined && prefs_dropped[i]) 
				style = "style='display:block'";

			var cnt2 = "<div><div class='dropheader'>"
			+ "<div class='plus' onclick='toggle_drop(this);'>+</div>"
			+ "<a href='#' onclick='toggle_drop(this);'>" + i 
			+ "</a>"
			+ "<a href='#' onclick='toggle_drop(this);'>" 
			+ " (" + count + ")</a>"
			+ "<img src='/img/arrow-left.png' alt='' onclick='toggle_drop(this);'"
			+ " class='arrow' /></div>"
			+ "<div class='dropbox' " + style + " id='drop'>" + groups_cnt[i].join('')
			+ "</div></div>"

			others_cnt = cnt2;
		}

		cnt += others_cnt; // last item
		cnt += "<div class='bottom'><a "
			+ "href='javascript:toggle_all(true);'>Alle anzeigen</a>"
			+ "&nbsp;|&nbsp;"
			+ "<a href='javascript:toggle_all(false);'>Keine anzeigen</a>"
			+ "<br /><a href='javascript:dialog();'>&Uuml;ber dieses Projekt</a>"
			+ "</div>";

		this._div.innerHTML = cnt;

		return this._div;
	};

	return ctrls;
}


function getIcon(entity) {
	var iconUri = "/img/marker-icon-green.png";

	return L.icon({
		iconUrl : iconUri
		, iconSize: new L.Point(26, 41)
		, iconAnchor: new L.Point(12, 41)
		, popupAnchor: new L.Point(1, -34)

		//shadowSize: new L.Point(41, 41),
		//shadowAnchor: [12, 41],
		//shadowUrl : "/img/marker-shadow.png"
	});
}


function savePreferences() {
	$(".ctrls input[type=checkbox]").each(function(){
		prefs[this.name] = this.checked;
	});
}


function restorePreferences() {
	$(".ctrls input[type=checkbox]").each(function(){
		if (prefs != undefined && prefs[this.name] != undefined) {
			this.checked = prefs[this.name];
		} else {
			prefs[ this.name ] = true;
			this.checked = true;
		}
			

		if (prefs[this.name] === false) {
			map.removeLayer(tile_groups[this.name]);
		} else {
			map.addLayer(tile_groups[this.name]);
		}
	});
}


function pull() {
console.log("socket pull")
	socket.emit('pull', {})
}


function toggle_all(v) {
	for (i in tile_groups) {
		if (v && !map.hasLayer(tile_groups[i])) {
			map.addLayer(tile_groups[i]);
		} else if (!v) {
			map.removeLayer(tile_groups[i]);
		}
		$("input[name=" + i + "]").attr('checked', v)
		prefs[i] = v;
	}
}


function updateTime(diff) {
	if (diff == undefined || diff == null)
		diff = updateFrequency;

	//console.log('update')
	now = new Date(now.getTime() + diff);

	var days = { 0: "So", 1: "Mo", 2: "Di", 3: "Mi", 4: "Do", 
			5: "Fr", 6: "Sa"};

	var time = {
		mins: now.getMinutes()
		, hours: now.getHours()
		, day: now.getDay()
		, secs: now.getSeconds()
	}

	var edit_btn = "<img src='/img/edit.png' class='edit' "
		+ "alt='Bearbeiten' title='Dargestellten Zeitpunkt ändern' "
		+ "onclick='javascript:toggle_picker();' "
		+ "onmouseout='picker_mouse(false)' "
		+ "onmouseover='picker_mouse(true)' />"

	time.mins = (time.mins < 10) ? ("0" + time.mins.toString()) : time.mins;
	time.hours = (time.hours < 10) ? ("0" + time.hours.toString()) : time.hours;
	time.secs = (time.secs < 10) ? ("0" + time.secs.toString()) : time.secs;

	$('#time').html("<div class='time'>"
		+ "<strong >" + days[time.day] + ", " 
		+ now.getDate() + "." 
		+ now.getMonth() + "." 
		+ now.getFullYear() 
		+ "<br />"
		+ time.hours + ":" + time.mins + edit_btn  + "</strong></div>");
		
//	$(".edit").click(function(e) {
//	});
	
	$("#ui-datepicker-div").html()
}


function toggle(el) {
	if (el.checked === false) {
		map.removeLayer(tile_groups[el.name]);
	} else {
		map.addLayer(tile_groups[el.name]);
	}
}


function toggle_drop(here) {
	if ($(here).parent().parent().find(".dropbox").css('display') === "none") {
		prefs_dropped[here.innerHTML] = true;
		$(here).parent().parent().find("img").attr("src", "/img/arrow-down.png");
		$(here).parent().parent().find(".plus").text("-");
	} else {
		prefs_dropped[here.innerHTML] = false;
		$(here).parent().parent().find("img").attr("src", "/img/arrow-left.png");
		$(here).parent().parent().find(".plus").text("+");
	}

	$(here).parent().parent().find(".dropbox").toggle("blind");
}


function dialog() {
	$("#datepicker").datetimepicker('setDate', now);
	$("#dialog-confirm").dialog(dialog_opt);
}


function submit() {
	now = $("#datepicker").datetimepicker('getDate');
   	//$("#datepicker").datetimepicker('setDate', d);
	
	//now = $("#datepicker").datetimepicker('getDate');
	pullNewEntries();
	//$("#dialog-confirm").dialog("close");
	toggle_picker();
}


var sw = true;
var sw_cnt = "";
function swap() {
	if (sw) {
		$("#spatz").css({'backgroundPosition': '-124px 0px'});
		sw = false;
	} else {
		$("#spatz").css({'backgroundPosition':'0px 0px'});
		sw = true;
	}
	
	$("#loading_box #label").text("Loading" + sw_cnt);
	sw_cnt += ".";
	if (sw_cnt.length == 4) sw_cnt = ".";
}
var sw_interval = setInterval("swap()", 500);

var picker = false;
function picker_mouse(v) {
	if (v === false && picker === true)
		$(".edit").attr('src', './img/edit-hover.png');	
	else if (v === false && picker === false)
		$(".edit").attr('src', './img/edit.png');	
	else if (v === true && picker === false) 
		$(".edit").attr('src', './img/edit-hover.png');	
	else if (v === true && picker === true) 
		$(".edit").attr('src', './img/edit-hover.png');	
}

function toggle_picker(evnt) {
	if (picker === false) {
		$("#ui-datepicker-div").css({'display': 'block'});
		picker = true;
	} else {
		$("#ui-datepicker-div").css({'display': 'none'});		
		picker = false;
	}
}

function addBtns() {
	if (!$("#ui-datepicker-div #ctrlbtns").length > 0) {
		$(
			'<div id="ctrlbtns">'
			+ '<button onclick="submit()" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" type="button">Einstellen</button>'
			+ '<button onclick="setNow()" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" type="button">Aktuelle Zeit</button>'
			+ '</div>'
		).appendTo('#ui-datepicker-div');
	}
}

function setNow() {
   	$("#datepicker").datetimepicker('setDate', new Date());
}
