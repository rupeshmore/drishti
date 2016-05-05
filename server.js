/*
	Drishti Proxy server to proxy the test url and inject drihti file and other dependencies.
*/
const express = require('express'),
			request = require('request'),
			serveStatic = require('serve-static'),
			app = express(),
			injectScript = require('html-inject-script'),
			config = require('./config.json'),
			opn = require('opn'),
			bodyParser = require('body-parser'),
			colors = require('colors'),
			clitable = require('cli-table');
			url = require("url");
/*
	Parse the url
*/
var urlParser = url.parse(config.url);
var slashes = urlParser.slashes ? '//' : '';
var origin = urlParser.protocol + slashes + urlParser.host;

var port = process.env.PORT || config.port || 3010;

// Array to hold list of javascript to inject into proxy
var jsArray = ['/js/lib/drishti.js','/helpers/specLoader.js'];

// if cli report is enabled push cliReporter.js to array of js injector
if (config.report.indexOf('cli') > -1) {
	jsArray.push('/helpers/cliReporter.js');
}

// serve express static folder. enable express to parse body as url encoded and json.
app.use(serveStatic(__dirname))
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json());

/*
	Express proxy get requests
*/
app.get('*', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	if(req.headers['accept'] && req.headers['accept'].indexOf('text/html') > -1) {
		request(origin + req.originalUrl).pipe(injectScript(jsArray)).pipe(res);
	} else {
		req.pipe(request(origin + req.originalUrl)).pipe(res);
	}
});

/*
	If cli reporter is enabled, create router to listen to results from cliReporter.js
*/
if (config.report.indexOf('cli') > -1) {
	var drishtiCliResultHeader = false;
	app.post('/drishtiResult/', function(req, res) {
		var result = req.body;
		/*if (!drishtiCliResultHeader) {
			console.log('Drishti Test Results'.cyan.bold.underline);
			drishtiCliResultHeader = true;
		}*/
		cliReport(result);
	});
}

/*
	express proxy post requests
*/
app.post('*', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	if ("content-type" in req.headers && req.headers['content-type'].indexOf('multipart/form-data') > -1) {
		request.post(origin + req.originalUrl).formData(req.body).pipe(injectScript(jsArray)).pipe(res);
	} else {
		request.post(origin + req.originalUrl).form(req.body).pipe(injectScript(jsArray)).pipe(res);
	}
});

// start express server by listening to the port
var server = app.listen(port);

// default to chrome browser on mac, on windows change to google only,
var browser = config.browser || 'google chrome';

// open the browser to start testing using drishti
// check browser is string or array. If string convert to array
if( typeof browser === 'string' ) {
		browser = [browser];
}

browser.forEach(function (browser) {
	opn('http://localhost:'+ port, {app:browser});
});

//var browserProcess = opn('http://localhost:'+ port, {app:browser});

/*
writing test http://webapplog.com/tdd/
*/
function cliReport(result) {
	if (!drishtiCliResultHeader) {
		console.log('Drishti Test Results'.cyan.bold.underline);
		drishtiCliResultHeader = true;
	}

	var table = new clitable({
		head: ['CssSelector', 'ElementName In SpecFile', 'Test Condition', 'Actual', 'Expected'],
		colWidths: [20, 20, 20, 20, 20]
	});
	//table.push(result.errorTable);
	//console.log(table.toString());
	//console.log('Url: "%s", '.white + 'Spec: "%s", '.magenta +'Pass: %s, '.green + 'Fail: %s, '.red +'Not Executed: %s '.yellow, req.body.url, req.body.spec,req.body.pass, req.body.fail, req.body.notExecuted);
	console.log('Url: "%s", '.white + 'Spec: "%s", '.magenta +'Pass: %s, '.green + 'Fail: %s, '.red +'Not Executed: %s '.yellow +'Browser: %s, Browser-Width: %s', origin + result.url, result.spec, result.pass, result.fail, result.notExecuted, result.browser, result.viewPort);

	//console.log('Url: "%s", '.white + 'Spec: "%s", '.magenta +'Pass: %s, '.green + 'Fail: %s, '.red +'Not Executed: %s '.yellow +'Browser: %s, Browser-Width: %s', origin + result.url, result.spec, result.pass, result.fail, result.notExecuted, result.browser, result.viewPort);
}
