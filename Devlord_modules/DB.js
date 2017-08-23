var fs = require('fs');
var dirpath = "./"
function setPath(str){
	dirpath = str
}
function load(str) {
	var contents = fs.readFileSync(dirpath + "/" + str + ".json").toString();
	return JSON.parse(contents)
}
function save(str, obj) {
	var contents = JSON.stringify(obj, null, "\t")
	fs.writeFile(dirpath + str + ".json", contents, function(err) {
		if(err) throw err;
	}); 
}
exports.setPath = setPath;
exports.load = load;
exports.save = save;