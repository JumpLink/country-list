var fs = require('fs');

var langDir = __dirname+"/country/cldr";
var dest = __dirname+"/all_languages.json";

var languages = {};

fs.readdir(langDir, function(err, list) {
  console.log(err);
  console.log(list);
  for (var i = 0; i < list.length; i++) {
    var file = langDir+"/"+list[i]+"/language.json";
    if (fs.existsSync(file)) {
      languages[list[i]] = require(file);
    }
  }

  // console.log(languages);

  var result = JSON.stringify(languages,null, 2);

  // console.log(result);

  fs.writeFile(dest, result, function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
      }
  }); 
});