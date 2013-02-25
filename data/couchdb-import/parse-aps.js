var fs = require('fs');

var ap_desc_data = fs.readFileSync("../access-points-desc.asc", "utf-8");
var ap_desc_lines = ap_desc_data.split("\n");

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
		, coords : []
		, type : "ap"
		, desc : getAPDesc(ap_lines[i])
	};

	obj.docs.push(entity);
}


function getAPDesc(ap) {
	for (var i in ap_desc_lines) {
		var line = ap_desc_lines[i].split("\t");
		var desc = ap_desc_lines[i]
				.replace(/^[A-Za-z\d.-]+\s+/g, "")
				.replace(/"/g, '');

		if (line[0] == ap)
			return desc;
	}
	return "";
}



console.log(JSON.stringify(obj));
