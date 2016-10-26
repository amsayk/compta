const charMap = require('./charmaps');

module.exports.normalize = function normalize(origString, keepCase){
	var newString = origString;

	for(var char in charMap){
		var rex = new RegExp('[' + charMap[char].toString() + ']', 'g');
		try{
			origString = origString.replace(rex, char);
		} catch(e) {
			console.log('error', origString);
		}
	}
	return keepCase? origString : origString.toLowerCase();
};
