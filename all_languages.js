var fs = require('fs');

var langDir = __dirname+"/country/cldr";
var dest = __dirname+"/all_languages.json";
var destBasic = __dirname+"/basic_languages.json";

var languages = {};

var basicLanguages = {};

var mergeObject = function (dest, src, prefix) {
  for(var key in src){
    //console.log(key+": "+src[key]);
    if(typeof prefix === 'undefined' || prefix === null)
      prefix = '';
    dest[key] = src[key]+prefix;
  }
  return dest;
}

// http://stackoverflow.com/questions/1359761/sorting-a-javascript-object
function sortObject(o) {
    var sorted = {},
    key, a = [];

    for (key in o) {
      if (o.hasOwnProperty(key)) {
        a.push(key);
      }
    }

    a.sort();

    //console.log(a);

    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = o[a[key]];
    }
    return sorted;
}

// add all languages codes to all languages codes to see if any languages code need translation
var addLangList = function (list) {
  for (var i = 0; i < list.length; i++) {////////
    languages[list[i]] = {};
    //languages[list[i]] = mergeObject(languages[list[i]], list, " [TRANSLATE ME]");
    for (var k = 0; k < list.length; k++) {
      languages[list[i]][list[k]] = list[k]+" [key]";
    }
  }
  return languages;
}

// replace all languages codes with english translation as default
var addEglishAsDefault = function (list) {
  var file = langDir+"/en/language.json";
  if (fs.existsSync(file)) {
    var en = require(file);
    for (var i = 0; i < list.length; i++) {
      languages[list[i]] = mergeObject(languages[list[i]], en, ' [en]');
    }
  }

  return languages;
}

var createBasic = function () {
  basicLanguages = {}
  for(var lang in languages) {
    if(lang.length === 2) {
      basicLanguages[lang] = {};
      for(var key in languages[lang]) {
        if(key.length === 2) {
          basicLanguages[lang][key] = languages[lang][key];
        }
      }
    }
  }

  var result = JSON.stringify(basicLanguages, null, 2);

  fs.writeFile(destBasic, result, function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The basic file was saved!");
      }
  }); 


}

var createAll = function (callback) {
  fs.readdir(langDir, function(err, list) {
    //console.log(err);
    // console.log(list);
    addLangList(list);
    addEglishAsDefault(list);
    for (var i = 0; i < list.length; i++) {
      var file = langDir+"/"+list[i]+"/language.json";
      if (fs.existsSync(file)) {
        languages[list[i]] = mergeObject(languages[list[i]], require(file), '');
        languages[list[i]] = sortObject(languages[list[i]]);
        //languages[list[i]] = require(file);
      }
    }

    languages = sortObject(languages);

    // console.log(languages);

    var result = JSON.stringify(languages, null, 2);

    // console.log(result);

    fs.writeFile(dest, result, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
        callback();
    }); 
  });
}



createAll(function () {
  createBasic();
});
