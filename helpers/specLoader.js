readTextFile("/config.json", function(text){
      var data = JSON.parse(text);
      drishtiSpecRules = data.drishtiSpecRules;
});
function readConfigSpecRule(drishtiSpecRules){
    if (drishtiSpecRules) {
      drishtiSpecRules.some(function(obj) {
        var conditionCheck = false,checks = 0;
        if(obj.condition) {
          if (obj.condition.cssSelector) {
            conditionCheck += cssSelectorCheck('title',obj.condition.cssSelector.title);
            checks += 1;
          }
          if (obj.condition.browserWidth) {
            conditionCheck += browserSizeCheck(obj.condition.browserWidth.min,obj.condition.browserWidth.max);
            checks += 1;
          }
        }
        if (conditionCheck === checks || conditionCheck === false) {
          if (!obj.file) {
            console.error('Drishti Spec Rule Error: spec file not specified in specRules');
          } else {
            window.visualSpec = obj.file.split("/").pop();
            loadJs('/js/visualSpec/' + obj.file, function () {
              drishti.run();
            });
            return true;
          }
        }/* else {
          console.log('Drishti Message : No spec rule match found');
        }*/
      });
    } else {
      console.warn('Drishti Message : No drishtiSpecRules found in config.json');
    }
}

// function to read the config file
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//function to loadFile in the dom.
function loadFile(fileRef, callback) {
    if (fileRef.readyState) {  //IE
        fileRef.onreadystatechange = function () {
            if (callback && (fileRef.readyState === 'loaded' || fileRef.readyState === 'complete')) {
                fileRef.onreadystatechange = null;
                callback();
            }
        };
    } else if (callback) {  //Others
        fileRef.onload = function () {
            callback();
        };
    }
    document.getElementsByTagName('head')[0].appendChild(fileRef);
}

//function to call loadFile and load javascript file.
function loadJs(url, callback) {
    var fileRef = document.createElement('script');
    fileRef.setAttribute('type', 'text/javascript');
    fileRef.setAttribute('src', url);
    loadFile(fileRef, callback);
}

// function to check the text for the cssSelector
function cssSelectorCheck(cssSelector,textMatch) {
  var cssSelectorResult = document.querySelector(''+cssSelector+'').textContent;
  return (new RegExp(textMatch)).test(cssSelectorResult);
}

function browserSizeCheck(min,max) {
  var width = window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
  window.viewPort = width;
  if (width >= min && width <= max) {
    return true;
  } else {
    return false;
  }
}

//listening to load event.
window.addEventListener('load', function() {
  readConfigSpecRule(drishtiSpecRules);
});

//listening to resize event and load drsihti spec.
window.addEventListener('resize', function(event){
  // To Do
  //readConfigSpecRule(drishtiSpecRules);
});
