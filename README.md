# Drishti

Drishti is a visual testing tool, with the concept of using the browser as a standalone tool for test execution and reporting.

## Why Drishti?

Visual regression testing involves lots of efforts using manual testing. Traditionally it is done using eyeballing.
Automated tools like webdriver can be used, but requires additional programming to drive this.

## How Drishti Works?

drishti.js runs the test against the drishtiSpec defined in visualSpec folder.

Multiple test specs can be defined in the different visualSpec file and can be loaded as defined in config.json.

Directory structure:
```
├── js/
│   ├── lib
│   │   ├── drishti.js
│   ├── visualSpec
│   │   ├── home.js
│   │   ├── mobile.js
```
## Drishti Reports
### Drishti publishes test results in the browser console.
<img src="/img/passed.jpg" width="720" style="border:1px solid #000000">


#### Failed tests
    Failed tests are highlighted in the browser with a red box and
    an error table is displayed in the console for detail report.
<img src="/img/failed.jpg" width="720" style="border:1px solid #000000">

In the above screenshot, the test is checking for:

1. link test checks for text suff2.co.nz link in stuff logo and found stuff.co.nz
2. weather widget test checks for Auckland city and found Wellington.


#### Skipped tests
    Elements that are not found on the page are skipped.
<img src="/img/skipped.jpg" width="720" style="border:1px solid #000000">

## Getting Started

###Pre-requisite
Nodejs installed on machine.

Download the Drishti content using zip or using  git `git checkout https://github.com/rupeshmore/drishti.git`

Go to Drishti directory
run `npm install`.
This will download all the nodejs dependencies.

## Drishti Server and visual Spec Configuration
edit the config.json file specify URL to test and spec rules.
```javascript
{
 "url": "http://www.stuff.co.nz/",
 "browser": "google chrome",
 "report":["cli"],
 "drishtiSpecRules":[
  {
	 "file":"iphone.js",
	 "condition":{
	  "cssSelector":{ "title":"Latest breaking news NZ" },
		 "browserWidth":{"min":0,"max":500}
   }
  },
  {
   "file":"homePage.js",
   "condition":{
    "cssSelector":{ "title":"Latest breaking news NZ" }
   }
	}
 ]
}
```
`url - The url to test`

`browser - browser to open (for windows change 'google chrome' to 'chrome')`

`report - ["cli"] : See results in command line.`

`file - visual spec file to load on a page. The visual spec file should be located in '/js/visualSpec/' folder`

```Condition - load the file based on conditions for a page.
	title (or any selector) and
	using screen size and
	devices (desktop/mobile) (coming soon)```


## Writing your first test
Create the following folder structure.

If you have downloaded the project, it should already have one.
```
drishti
├── js
│   ├── lib
│   │   ├── drishti.js
│   ├── visualSpec
│   │   ├── someFile.js
```
Start writing the test files in the visualSpec folder.

Visual spec test files are written in .js files.

Edit the config.json file located in the structure to specify the rule to load the visual spec test files. Within drishtiSpecRules specify which test file to load on conditions.

```
drishti
├── config.json
```
```
"drishtiSpecRules":[
	{
	  "file":"bbcMobileHome.js",
	  "condition":{
	  	"browserWidth":{"min":0,"max":320}
	  }
	},
	{
	  "file":"bbcDesktopHome.js",
	  "condition":{
	    "cssSelector":{ "#page-title":"BBC Homepage" },
	    "browserWidth":{"min":0,"max":2000}
	  }
	}
]
```

## Running Drishti tests
Within drishti folder, run command `node server.js` or `npm start`.

This will start the drishti server and open the browser to test.
Navigate to different pages manually (or using drishti click method) to load new visual spec test files.

(See Video)


## Using examples to get you started
1. Copy the files from 'example/visualSpec/' folder under the 'js/visualSpec/' folder.
2. Edit the config.json file 'drishtiSpecRules' as shown above.
3. run `node server.js` or `npm start` to start test on bbc.com page

## Drishti test results?
Drishti results can be viewed in browser console directly. For continuous integration (CI) it provides command line reporting.
Drishti will highlight all the test failures in the browser directly in red. Highlighting all the CSS selectors that failed during the test.


## How to write a visualSpec file?
visualSpec files accept the below methods and format. All methods must use {} notations.

(See examples folder for more).

```javascript
var drishtiSpec = {
  elementA : {
      // Mandatory css selector value for element
      selector : 'css Selector Value',

      /* Relative Position methods*/
      // elementA is above elementB by 30px
      above : {elementA : 30 },

      // elementA is below elementC by 40px
      below : {elementC : 40 },

      // elementA is on left of elementD by 50px
      leftOf : {elementD : 50},

      // elementA is on right of elementE by 20px                           
      rightOf :{elementE : 20},

      // elementA is inside elementF with left 20px, right 20px, and top 10px, bottom 50 px
      inside : {
          elementF: { left:20, right:20,top:10, bottom:50 }
      },

      // Accepts 4 values 'Top', 'Bottom', 'Left', 'Right'
      aligned: {elementH:'Top'},

      // elementA relative height to elementG
      heightAs : {elementG : '100%' },

      // elementA relative width to elementG                    
      widthAs : {elementG : '90%' },

      /* Element only methods*/
      // elementA width is 200 px
      width : 200,

      // elementA height is 100 px
      height : 100,

      // elementA text exact match
      textIs : 'exact match',

      // elementA substring text match
      textContains : 'substring',

      // elementA is visible on page? (boolean true or false)
      visible : true,

      // elementA is absent on the page? (boolean true or false)
      absent : false,

      // elementA is in screen-view? (boolean true or false)                              
      inViewport : true,

      // elementA attribute 'href' has value 'http://www.abc.co.nz' (exact match)
      attribute : {href :'http://www.abc.co.nz'},

       // elementA css property 'background-image' has 'header-title.png' (exact match)
      cssContains : {'background-image' : 'header-title.png'}

     /* child Methods */
     // css value of child and number of times the child appears in the page
     childItems : {'.main_article' : 5},

     // number of '<li>' within elementA
     childList : 6,

     // this can be repeat of all above methods (including childItems, childList & child itself)
     child : {}   

     /* Action Methods */
     // Shows elementA is screen view. (performs page-up/down depending on the element location)
     showInViewport : true,

     // Enters the text 'Random' for elementA if it is input type.
     enterText : 'Random',

     // clicks on elementA
     click : true,

      /* Page Scroll Actions */
      // Performs number of page downs
      pageDown : 1,

      // Performs number of page up
      pageUp : 1,
  }  
}
```

## Backstory
Drishti was built to test responsive design across multiple browsers and devices and using real browsers.
The idea and concept were influenced during technology labs working at stuff.co.nz

Drishti was tested on chrome and mac platform. It also works in firefox and safari and IE and mobile devices.
