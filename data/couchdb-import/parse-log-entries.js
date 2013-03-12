var fs = require('fs');

var authlog_data = fs.readFileSync("../wlan-client-authlog.anon", "utf-8");
var authlog_lines = authlog_data.split("\n");

var obj = {
	docs: []
};

var cnt = 0;
var file_cnt = 0;

for (var i in authlog_lines) {
	var line = authlog_lines[i].split(" ");
	var ap_label = line[6];
	var entity = {
		weekday : line[0]
		, ouid : line[3]
		, uuid : line[4]
		, ap : ap_label
		, type : "log_entry"
	};

	if (line.length < 5) continue;

	var date = line[1];
	date = date.split(".");

	var time = line[2];
	time = time.split(":");

	// new Date(year, month, day, hours, mins, secs);
	var now = new Date(date[2], date[1]-1, date[0], 
			   time[0], time[1], time[2]);
	entity.time =  now.getTime();

	var arr = {"Sun" : 0, "Mon" : 1, "Tue" : 2, "Wed" : 3, 
			"Thu" : 4, "Fri" : 5, "Sat" : 6};

	entity.weekday = arr[entity.weekday];
	obj.docs.push(entity);

	if ((++cnt % 1000) === 0) {
		fs.writeFileSync("./parsing/" + (file_cnt++), JSON.stringify(obj),
		"utf-8");
		obj.docs = [];
	}
}

//console.log(JSON.stringify(obj.docs));
