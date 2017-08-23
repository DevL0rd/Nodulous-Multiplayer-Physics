var fs = require('fs');
var Namespace = "Console"
var loggingPath = "./Logs/"
var debugenabled = false;
function log(str = "", isError = "", nspace = Namespace){
	var logStr = "[" + [nspace] + "]: " +  str 
	console.log(logStr)
	var formattedString = logStr + "\r\n"
	if (!fs.existsSync(loggingPath)){
		fs.mkdirSync(loggingPath);
	}
	if (debugenabled){
		fs.appendFile(loggingPath + 'Con_Out.txt', formattedString, function (err) {
			if (err) throw err;
		});
		fs.appendFile(loggingPath + 'Con_Out_' + nspace + '.txt', formattedString, function (err) {
			if (err) throw err;
		});
	}
	
	if (isError) {
		fs.appendFile(loggingPath + 'Err_Out.txt', formattedString, function (err) {
			if (err) throw err;
		});
		fs.appendFile(loggingPath + 'Err_Out_' + nspace + '.txt', formattedString, function (err) {
			if (err) throw err;
		});
	}
}
function setNamespace(str){
	Namespace = str
}
function setDebug(bool){
	debugenabled = bool
}
function setLoggingPath(str){
	loggingPath = str
	if (!fs.existsSync(loggingPath)){
		fs.mkdirSync(loggingPath);
	}
}
exports.log = log;
exports.setNamespace = setNamespace;
exports.setLoggingPath = setLoggingPath;
exports.setDebug = setDebug;