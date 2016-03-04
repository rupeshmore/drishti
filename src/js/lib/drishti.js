/*
 * Drishti Visual Testing Library in javascript.
 *
 * In Yogo term, 'Drishti' means view or sight.
 * It means directed focus of gaze, during meditation.

 * This testing library is capable of doing visual regression testing, with focus on using browser as a standalone tool to execute tests.

 * Author : Rupesh More
 * Email  : rupesh.more@gmail.com
 * Github : https://github.com/rupeshmore
 * LinkedIn : https://nz.linkedin.com/in/morerupesh
 */
var drishti = {
	//passes : 0, failures : 0, notExecuted : 0, duration : 0,
	elmVar  : {elm : '', elmRef : ''},
	//assertsDone : 0,
	//elmName : '', elm1 : '',
	isElmNull : false, 	setChildParentFlag : false,
	actualValue : '',  expectedValue : ''	, expectedValueofRef : '',
	errorTable : [],notExecutedTable : [],
	init: function () {
		drishti.passes = 0; drishti.failures = 0; drishti.notExecuted = 0; drishti.duration = 0;
		drishti.assertsDone = 0;
	},
	assert: function(value1,value2){
		drishti.assertsDone += 1;
		if (value1 !== value2) return drishti.error();
		else return drishti.pass();
	},
	iterate: function(obj) {
		if(typeof mainObj != 'object') mainObj = obj;
		if(typeof parentObj != 'string') parentObj = '';
		if(typeof conditionValue != 'string') conditionValue = '';

	    for (var property in obj) {
	        if (obj.hasOwnProperty(property)) {
	            if (typeof obj[property] == 'object'){
				    if ('selector' in obj[property]){
				    	drishti.elm1 = obj[property]['selector'];
			    		drishti.elmVar.elm = document.querySelector(''+drishti.elm1+'');
			    		drishti.elmName = property; // reporting
			    	};
			    	drishti.isElmNull = drishti.isAbsent(drishti.elmVar.elm); // handle null elements
		    		console.groupCollapsed(property); // reporting
	            	conditionValue +=  property + ' : ';
	            	refObj = Object.keys(obj[property])[0];

	            	parentObj = property;
	            	if (refObj in mainObj) {
	            		// To Do
	            		// elm referenced with itself please provide valid reference. //if (true) {};
	            		drishti.elmVar.elmRef = document.querySelector(''+mainObj[refObj]['selector']+'');
	            	}
	            	// child object handler -- start
	            	if (parentObj === 'child') {
	            		childObj = Object.keys(obj[property]);
	            		drishti.setChildParentFlag = false;
	            	};
	            	if (typeof childObj === 'object') {
	            		var childIndex = childObj.indexOf(property);
	            		if (childIndex !== -1) {
		            		refObj = childObj[childIndex];
		            		if (!drishti.isElmNull) (drishti.methods.child)(); // call child function with refObj updated
	            		};
	            	};
	            	// child object handler -- end

	            	myMethods = drishti.methods[property];
	            	if (myMethods !== undefined && !drishti.isElmNull && parentObj !== 'child') drishti.actualValue = myMethods();
	            	drishti.iterate(obj[property]);
	            }
	            else{
	            	drishti.expectedValue = obj[property];
	            	printValue = drishti.expectedValue; // Safari showing undefined character in the object
	            	if (property !== 'selector') {
	            		conditionValue += property +' : '+ drishti.expectedValue;

		            	// check if the expected value is string and do the conversion.
		            	if (/(\d+)%$/.test(drishti.expectedValue)) {
	    					var percentageDivisor = 100 / parseInt(RegExp.$1);
	    					drishti.expectedValue = drishti.expectedValueofRef/percentageDivisor;
	    					printValue = JSON.stringify(printValue);
	    				} else if (/^([\+\-])(\d+)/.test(drishti.expectedValue)){
	    					drishti.expectedValue = drishti.expectedValueofRef + parseInt(RegExp.$_);
	    					printValue = JSON.stringify(printValue);
				    	};

				    	//if element is null call only absent method to check
				    	if (drishti.isElmNull && property !== 'absent') {
		            		drishti.actualValue = null;
		            		console.log('%c '+property+' : '+printValue+'  		Element not present, no test executed','color:orange');
		            		drishti.notRun();
		            	}else{
		            		//if (parentObj === 'attribute') {refObj = property; property = parentObj};
		            		myMethods = drishti.methods[property];
		            		if (myMethods !== undefined) drishti.actualValue = myMethods();
		            	}

		            	if (drishti.actualValue !== null) {
			            	//Handling response from aligned method and cssContains method
			            	if((parentObj === 'aligned' || parentObj === 'cssContains') && drishti.actualValue.indexOf(drishti.expectedValue)!== -1) drishti.actualValue = drishti.expectedValue;

			                assertStatus = drishti.assert(drishti.actualValue,drishti.expectedValue);
			                
		                	//Console line Reporting
					        if (assertStatus) console.log('%c '+property+' : '+printValue+'','color:green;');
							else console.log('%c '+property+' : '+printValue+'  		{Expected = '+drishti.expectedValue+ ', Actual = '+drishti.actualValue+'}','color:red;','');
		                };
	            	}
	            };
	           	conditionValue = '';
	        }
		}
		console.groupEnd(); // reporting
	},
	showError: function() {
		console.table(drishti.errorTable);
	},
	showNotExecuted: function() {
		console.table(drishti.notExecutedTable);
	},
	pass: function() {
		drishti.passes += 1;
		return true;
	},
	error: function() {
		if (!drishti.isElmNull) drishti.elmVar.elm.style.outline = '#f00 solid 5px';
		if(Array.isArray(drishti.actualValue)) drishti.actualValue = JSON.stringify(drishti.actualValue);
		drishti.errorTable.push({Element:drishti.elm1,ElementName:drishti.elmName,Condition:conditionValue,Actual:drishti.actualValue,Expected:drishti.expectedValue});
		drishti.failures += 1;
		return false;
	},
	notRun: function() {
		drishti.notExecutedTable.push({Element:drishti.elm1,ElementName:drishti.elmName,Condition:conditionValue,Actual:drishti.actualValue,Expected:drishti.expectedValue});
		drishti.notExecuted += 1;
		return null;
	},
	getComputedStyle: function(element, style) {
		var computedStyle = {};
	    if (typeof element.currentStyle != "undefined") {
	        computedStyle = element.currentStyle[style];
	    }else {
	        computedStyle = document.defaultView.getComputedStyle(element, null)[style];
	    }
	    return computedStyle;
	},
	isVisible: function(element) {
		if (element.offsetWidth > 0 || element.offsetHeight > 0) return true;
		else return false;
	},
	isAbsent: function(element) {
		if (element === null) return true;
		else return false;
	},
	run:function() {
		if (typeof drishtiSpec === 'undefined') {
				console.error('drishtiSpec is not defined. Make sure you have visualSpec folder and visualSpec file');
				return null;
		}
		var startTime = new Date();
		console.clear();
		drishti.init();
		console.log('%cDrishti%c%c Visual Testing' ,'color:blue;font-size : 25px','background: url("./drishti/images/drishti-eye-blue-sm.png");padding-right:100px;font-size:20px; text-align: center',''); // Reporting
		console.groupCollapsed('Drishti testing suite result');
		drishti.iterate(drishtiSpec);
		console.groupEnd();

		var endTime = new Date();
		duration = (endTime - startTime);
		drishti.result();
	},
	result:function () {
		if (drishti.notExecuted < 1) {
			console.log('%cpasses: %c'+drishti.passes+' , %cfailures: %c'+drishti.failures+' %c, duration: %c'+duration+'ms',
			  'color:green;font-size:16px','color:green;font-style:italic;font-size:18px',
				'color:red;font-size:16px','color:red;font-style:italic;font-size:18px',
				'font-size:16px', 'font-style:italic;font-size:18px');
		}else{
			console.log('%cpasses: %c'+drishti.passes+' , %cfailures: %c'+drishti.failures+' , %cnot executed: %c'+drishti.notExecuted+' %c, duration: %c'+duration+'ms',
			  'color:green; font-size : 16px','color:green; font-style:italic; font-size : 18px',
				'color:red; font-size : 16px','color: red; font-style: italic;font-size : 18px',
				'color:orange; font-size : 16px','color: orange; font-style: italic;font-size : 18px','font-size : 16px',
				'font-style: italic;font-size : 18px');
		};
		if (drishti.failures > 0) {
			console.groupCollapsed('%cdrishti: Error Table','color:grey; font-size:10;');
			drishti.showError();
			console.groupEnd();
		}
	},
	methods : {
		above:function(){
			return drishti.elmVar.elmRef.offsetTop - (drishti.elmVar.elm.offsetTop + drishti.elmVar.elm.offsetHeight);
		},
		below:function() {
			return drishti.elmVar.elm.offsetTop - (drishti.elmVar.elmRef.offsetTop + drishti.elmVar.elmRef.offsetHeight);
		},
		leftOf:function() {
			return  drishti.elmVar.elmRef.offsetLeft - (drishti.elmVar.elm.offsetLeft + drishti.elmVar.elm.offsetWidth);
		},
		rightOf:function() {
			return drishti.elmVar.elm.offsetLeft - (drishti.elmVar.elmRef.offsetLeft + drishti.elmVar.elmRef.offsetWidth);
		},
		childItems:function() {
			return drishti.elmVar.elm.querySelectorAll(''+refObj+'').length;
		},
		widthAs:function() {
	    	drishti.expectedValueofRef = drishti.elmVar.elmRef.offsetWidth;
			return drishti.elmVar.elm.offsetWidth;
		},
		heightAs:function() {
	    	drishti.expectedValueofRef = drishti.elmVar.elmRef.offsetHeight;
			return drishti.elmVar.elm.offsetHeight;
		},
		width:function(){
			return drishti.elmVar.elm.offsetWidth;
		},
		height:function(){
			return drishti.elmVar.elm.offsetHeight;
		},
		absent:function(){
			return drishti.isAbsent(drishti.elmVar.elm);
		},
		visible:function(){
			return drishti.isVisible(drishti.elmVar.elm);
		},
		top:function(){
			return drishti.elmVar.elm.offsetTop - drishti.elmVar.elmRef.offsetTop;
		},
		right:function(){
			return (drishti.elmVar.elmRef.offsetLeft + drishti.elmVar.elmRef.offsetWidth) - (drishti.elmVar.elm.offsetLeft + drishti.elmVar.elm.offsetWidth);
		},
		bottom:function(){
			return (drishti.elmVar.elmRef.offsetTop + drishti.elmVar.elmRef.offsetHeight) - (drishti.elmVar.elm.offsetTop + drishti.elmVar.elm.offsetHeight);
		},
		left:function(){
			return drishti.elmVar.elm.offsetLeft - drishti.elmVar.elmRef.offsetLeft;
		},
		childList:function(){
			return drishti.elmVar.elm.querySelectorAll('li').length;
		},
		textIs:function(){
			return drishti.elmVar.elm.textContent;
		},
		textContains:function(){
			var textValue = drishti.elmVar.elm.textContent;
			if (textValue.indexOf(drishti.expectedValue) !== -1) return drishti.expectedValue;
			else return textValue;
		},
		aligned:function(){
			var alignedValue = [];
			elmRefTop = drishti.elmVar.elmRef.offsetTop;
			elmTop = drishti.elmVar.elm.offsetTop;
			elmRefLeft = drishti.elmVar.elmRef.offsetLeft;
			elmLeft = drishti.elmVar.elm.offsetLeft;
			if(elmRefTop === elmTop) alignedValue.push('Top');
			if(elmRefLeft === elmLeft) 	alignedValue.push('Left');
			if((elmRefTop+drishti.elmVar.elmRef.offsetHeight) === (elmTop+drishti.elmVar.elm.offsetHeight)) alignedValue.push('Bottom');
			if((elmRefLeft+drishti.elmVar.elmRef.offsetWidth) === (elmLeft+drishti.elmVar.elm.offsetWidth)) alignedValue.push('Right');
			return alignedValue;
		},
		attribute:function(){
			var elmAttr = drishti.elmVar.elm.attributes[refObj];
			if (elmAttr !== undefined) return elmAttr.value;
		},
		cssContains:function(){
			return drishti.getComputedStyle(drishti.elmVar.elm,refObj);
		},
		click:function () {
			if (drishti.expectedValue) drishti.elmVar.elm.click();
			return null;
		},
		enterText:function () {
			drishti.elmVar.elm.value = '';
			return null;
		},
		child:function () {
			if (!drishti.setChildParentFlag) {
				parentElm = drishti.elmVar.elm;
				drishti.setChildParentFlag = true;
			};
			drishti.elmVar.elm = parentElm.querySelector(''+refObj+'');
			return null;
		},
		showInViewport:function() {
			if (drishti.expectedValue) drishti.elmVar.elm.scrollIntoView();
			return null;
		},
		inViewport: function () {
	    	var elementTop = drishti.elmVar.elm.getBoundingClientRect().top,
	        	elementBottom = drishti.elmVar.elm.getBoundingClientRect().bottom;
		    return elementTop >= 0 && elementBottom <= window.innerHeight;
		    // Partly visible is what you need? Go with this:
		    //return elementTop < window.innerHeight && elementBottom >= 0;
		},
		scroll:function(){

		},
		pageDown:function(){
			//if (parentObj === 'windowActions')
			window.scrollBy(0, window.innerHeight);
			return null;
		},
		pageUp:function(){
			if (parentObj === 'windowActions') window.scrollBy(0, -(window.innerHeight));
		}
	}
};

/* run drishti library when page load has finished */
if(window.jQuery){
	$(document).ready(function() { drishti.run(); }); //$(window).bind("load", function() { drishti.run(); });
}else {
	document.onload = drishti.run();
}
