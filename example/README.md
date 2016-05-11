## Drishti tests running on bbc.com

1. Copy contents the files from visualSpec folder and put into `/js/visualSpec/` folder.
2. Edit drishtiSpecRules in config.json
```javascript
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
```
3. In the drishti folder, run `npm start` to start the test on `bbc.com`.
4. View the desktop results by opening the browser console.
5. On mobile, access the test page using machine's IP  address and port number address
6. View mobile results in the console using remote debugging or the command line.
