var fs = require('fs');

// parse file stuff
var ap_data = fs.readFileSync("./data/access-points-desc.asc", "utf-8");
var ap_lines = ap_data.split("\n");

var authlog_data = fs.readFileSync("./data/wlan-client-authlog.anon", "utf-8");
var authlog_lines = authlog_data.split("\n");

var entities = [];

for (var i in authlog_lines) {
	var line = authlog_lines[i].split(" ");
	var ap_label = line[6];
	var entity = {
		weekday : line[0]
		, ouid : line[3]
		, uuid : line[4]
		, ap : ap_label
	};

	var date = line[1];
	date = date.split(".");

	var time = line[2];
	time = time.split(":");

	// new Date(year, month, day, hours, mins, secs);
	var now = new Date(date[2], date[1], date[0], 
			   time[0], time[1], time[2]);
	entity.time = now.getTime();

	var arr = {"Sun" : 0, "Mon" : 1, "Tue" : 2, "Wed" : 3, 
			"Thu" : 4, "Fri" : 5, "Sat" : 6};

	// correlate with ap_data
	entity.desc = getAPDesc(ap_label);
	entity.weekday = arr[entity.weekday];
	entities.push(entity);
	console.log(entity);

	break;
}

function getAPDesc(ap) {
	for (var i in ap_lines) {
		var line = ap_lines[i].split("\t");
		var desc = ap_lines[i]
				.replace(/^[A-Za-z\d.-]+\s+/g, "")
				.replace(/"/g, '');

		if (line[0] == ap)
			return desc;
	}
	return "";
}



