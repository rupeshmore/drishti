
//function to send drishti test results to nodejs app.
function sendPostRequest(drishtiResults) {
  xhr = new XMLHttpRequest();
  var url = '/drishtiResult/';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
          var json = JSON.parse(xhr.responseText);
      }
  }
  var data = JSON.stringify(drishtiResults);
  xhr.send(data);
}

//listening to drishti-finished event and post result to nodejs server.
document.addEventListener('drishti-finished', function() {
  // create object based on drishti results
  var drishtiResults = {
    url : location.pathname,
    spec: window.visualSpec,
    pass : drishti.passes,
    fail : drishti.failures,
    notExecuted : drishti.notExecuted,
    errorTable : drishti.errorTable,
    notExecutedTable : drishti.notExecutedTable,
    browser: navigator.sayswho,
    viewPort : window.viewPort
  };
  // call the post request method to send drishti test results.
  sendPostRequest(drishtiResults);
});

// Browser Detection function
navigator.sayswho = (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;
    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    return M;
})();
