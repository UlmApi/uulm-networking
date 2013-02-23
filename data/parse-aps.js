var fs = require('fs');

var ap_data = fs.readFileSync("./aps", "utf-8");
var ap_lines = ap_data.split("\n");

var cnt = 0;
var file_cnt = 0;
var obj = {
	docs : []
};

for (var i in ap_lines) {
	if (ap_lines[i].length === 0) continue;

	var entity = {
		_id : ap_lines[i]
		, [[0, 0]]
		, type : "ap"
	};

	obj.docs.push(entity);
}


console.log(JSON.stringify(obj));
