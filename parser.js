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
		day : line[0]
		, date : line[1]
		, time : line[2]
		, ouid : line[3]
		, uuid : line[4]
		, ap : ap_label
	};

	// correlate with ap_data
	entity.desc = getAPDesc(ap_label);

	entities.push(entity);

	break;
}

function getAPDesc(ap) {
	for (var i in ap_lines) {
		var line = ap_lines[i].split("\t");
		var desc = ap_lines[i].replace(/^[A-Za-z\d.-]+\s+/g, "");

		if (line[0] == ap)
			return desc;
	}
	return "";
}

