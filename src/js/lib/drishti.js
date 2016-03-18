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
	mainObj: '',
	parentObj: '',
	conditionValue: '',
	refObj: '',
	elmVar: {
		elm: '',
		elmRef: ''
	},
	elmName: '',
	elm1 : '',
	isElmNull: false,
	setChildParentFlag : false,
	actualValue: '',
	expectedValue: '',
	expectedValueofRef: '',
	errorTable: [],
	notExecutedTable: [],
	init: function () {
		drishti.passes = 0;
		drishti.failures = 0;
		drishti.notExecuted = 0;
		drishti.duration = 0;
		drishti.assertsDone = 0;
		for (var i in drishti.errorTable) {
			var elm = drishti.errorTable[i].Element;
			document.querySelector(elm).style.outline = '';
			drishti.errorTable.splice(i, 1);
		}
	},
	assert: function(value1,value2) {
		this.assertsDone += 1;
		if (value1 !== value2) {
			return this.error();
		}else {
			return this.pass();
		}
	},
	iterate: function(obj) {
		var myMethods;
		if (typeof this.mainObj != 'object') this.mainObj = obj;
		if (typeof this.parentObj != 'string') this.parentObj = '';
		if (typeof this.conditionValue != 'string') this.conditionValue = '';

		for (var property in obj) {
			if (obj.hasOwnProperty(property)) {
				if (typeof obj[property] == 'object') {
					if ('selector' in obj[property]) {
						drishti.elm1 = obj[property]['selector'];
						drishti.elmVar.elm = document.querySelector(''+drishti.elm1+'');
						drishti.elmName = property;
					}
					drishti.isElmNull = drishti.isAbsent(drishti.elmVar.elm); // handle null elements
					console.groupCollapsed(property); // console reporting
					this.conditionValue +=  property + ' : ';
					drishti.refObj = Object.keys(obj[property])[0];
					drishti.parentObj = property;
					if (drishti.refObj in this.mainObj) {
						// To Do
						// elm referenced with itself please provide valid reference. //if (true) {};
						drishti.elmVar.elmRef = document.querySelector(''+drishti.mainObj[drishti.refObj]['selector']+'');
					}
					// child object handler -- start
					if (drishti.parentObj === 'child') {
						var childObj = Object.keys(obj[property]);
						drishti.setChildParentFlag = false;
					};
					if (typeof childObj === 'object') {
						var childIndex = childObj.indexOf(property);
						if (childIndex !== -1) {
							drishti.refObj = childObj[childIndex];
							if (!drishti.isElmNull) (drishti.methods.child)(); // call child function with refObj updated
						}
					}
					// child object handler -- end
					console.log()
					myMethods = drishti.methods[property];
					if (myMethods !== undefined && !drishti.isElmNull && drishti.parentObj !== 'child') this.actualValue = myMethods();
					drishti.iterate(obj[property]);
				}else if (property !== 'selector') {
						this.expectedValue = obj[property];
						var printValue = this.expectedValue; // Safari showing undefined character in the object
						drishti.conditionValue += property +' : '+ drishti.expectedValue;
						// check if the expected value is string and do the conversion.
						if (/(\d+)%$/.test(this.expectedValue)) {
							var percentageDivisor = 100 / parseInt(RegExp.$1);
    					this.expectedValue = this.expectedValueofRef/percentageDivisor;
    					printValue = JSON.stringify(printValue);
    				}else if (/^([\+\-])(\d+)/.test(this.expectedValue)) {
    					this.expectedValue = this.expectedValueofRef + parseInt(RegExp.$_);
    					printValue = JSON.stringify(printValue);
			    	};

			    	//if element is null call only absent method to check
			    	if (drishti.isElmNull && property !== 'absent') {
							this.actualValue = null;
							console.log('%c '+property+' : '+printValue+'			Element not present, no test executed','color:orange');
							this.notExec();
						}else {
							//if (parentObj === 'attribute') {refObj = property; property = parentObj};
							myMethods = this.methods[property];
							if (myMethods !== undefined) {
								this.actualValue = myMethods();
							}
						}

						if (this.actualValue !== null) {
							//Handling response from aligned method and cssContains method
							if ((drishti.parentObj === 'aligned' || drishti.parentObj === 'cssContains') && this.actualValue.indexOf(this.expectedValue)!== -1) {
								this.actualValue = this.expectedValue;
							}
							//var assertStatus = drishti.assert(this.actualValue,this.expectedValue);
							//Console line Reporting
							if (drishti.assert(this.actualValue,this.expectedValue)) {
								console.log('%c '+property+' : '+printValue+'','color:green;');
							}else {
								console.log('%c '+property+' : '+printValue+'			{Expected: '+drishti.expectedValue+ ', Actual: '+drishti.actualValue+'}','color:red;','');
							}
						}
				}
				drishti.conditionValue = '';
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
		this.failures += 1;
		if (!this.isElmNull) {
			this.elmVar.elm.style.outline = '#f00 solid 5px';
		}
		if (Array.isArray(this.actualValue)) {
			this.actualValue = JSON.stringify(this.actualValue);
		}
		this.errorTable.push({
			Element:this.elm1,
			ElementName:this.elmName,
			Condition:this.conditionValue,
			Actual:this.actualValue,
			Expected:this.expectedValue
		});
		return false;
	},
	notExec: function() {
		this.notExecuted += 1;
		this.notExecutedTable.push({
			Element:this.elm1,
			ElementName:this.elmName,
			Condition:this.conditionValue,
			Actual:this.actualValue,
			Expected:this.expectedValue
		});
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
		if (element.offsetWidth > 0 || element.offsetHeight > 0) {
			return true;
		}else {
			return false;
		}
	},
	isAbsent: function(element) {
		if (element === null) {
			return true;
		}else {
			return false;
		}
	},
	run:function() {
		if (typeof drishtiSpec === 'undefined') {
			console.error('drishtiSpec is not defined. Make sure you have visualSpec folder and visualSpec file');
			return null;
		}
		var startTime = new Date();

		console.clear();
		this.init();
		console.log('%cDrishti%c%c Visual Testing' ,'color:blue;font-size : 25px','background: url("./images/drishti-eye-blue-sm.png");padding-right:100px;font-size:20px; text-align: center',''); // Reporting
		console.groupCollapsed('Drishti testing suite result');
		this.iterate(drishtiSpec);
		console.groupEnd();

		var endTime = new Date();
		duration = (endTime - startTime);
		this.result();
	},
	result:function () {
		if (this.notExecuted < 1) {
			console.log('%cpasses: %c'+this.passes+' , %cfailures: %c'+this.failures+' %c, duration: %c'+duration+'ms',
			  'color:green;font-size:16px','color:green;font-style:italic;font-size:18px',
				'color:red;font-size:16px','color:red;font-style:italic;font-size:18px',
				'font-size:16px', 'font-style:italic;font-size:18px');
		}else {
			console.log('%cpasses: %c'+this.passes+' , %cfailures: %c'+this.failures+' , %cnot executed: %c'+this.notExecuted+' %c, duration: %c'+duration+'ms',
			  'color:green; font-size : 16px','color:green; font-style:italic; font-size : 18px',
				'color:red; font-size : 16px','color: red; font-style: italic;font-size : 18px',
				'color:orange; font-size : 16px','color: orange; font-style: italic;font-size : 18px','font-size : 16px',
				'font-style: italic;font-size : 18px');
		};
		if (this.failures > 0) {
			console.groupCollapsed('%cdrishti: Error Table','color:grey; font-size:10;');
			this.showError();
			console.groupEnd();
		}
	},
	methods: {
		above: function() {
			return drishti.elmVar.elmRef.offsetTop - (drishti.elmVar.elm.offsetTop + drishti.elmVar.elm.offsetHeight);
		},
		below: function() {
			return drishti.elmVar.elm.offsetTop - (drishti.elmVar.elmRef.offsetTop + drishti.elmVar.elmRef.offsetHeight);
		},
		leftOf: function() {
			return  drishti.elmVar.elmRef.offsetLeft - (drishti.elmVar.elm.offsetLeft + drishti.elmVar.elm.offsetWidth);
		},
		rightOf: function() {
			return drishti.elmVar.elm.offsetLeft - (drishti.elmVar.elmRef.offsetLeft + drishti.elmVar.elmRef.offsetWidth);
		},
		childItems: function() {
			return drishti.elmVar.elm.querySelectorAll(''+drishti.refObj+'').length;
		},
		widthAs: function() {
	    	drishti.expectedValueofRef = drishti.elmVar.elmRef.offsetWidth;
			return drishti.elmVar.elm.offsetWidth;
		},
		heightAs: function() {
	    	drishti.expectedValueofRef = drishti.elmVar.elmRef.offsetHeight;
			return drishti.elmVar.elm.offsetHeight;
		},
		width: function() {
			return drishti.elmVar.elm.offsetWidth;
		},
		height: function() {
			return drishti.elmVar.elm.offsetHeight;
		},
		absent: function() {
			return drishti.isAbsent(drishti.elmVar.elm);
		},
		visible: function() {
			return drishti.isVisible(drishti.elmVar.elm);
		},
		top: function() {
			return drishti.elmVar.elm.offsetTop - drishti.elmVar.elmRef.offsetTop;
		},
		right: function() {
			return (drishti.elmVar.elmRef.offsetLeft + drishti.elmVar.elmRef.offsetWidth) - (drishti.elmVar.elm.offsetLeft + drishti.elmVar.elm.offsetWidth);
		},
		bottom: function() {
			return (drishti.elmVar.elmRef.offsetTop + drishti.elmVar.elmRef.offsetHeight) - (drishti.elmVar.elm.offsetTop + drishti.elmVar.elm.offsetHeight);
		},
		left: function() {
			return drishti.elmVar.elm.offsetLeft - drishti.elmVar.elmRef.offsetLeft;
		},
		childList: function() {
			return drishti.elmVar.elm.querySelectorAll('li').length;
		},
		textIs: function() {
			return drishti.elmVar.elm.textContent;
		},
		textContains: function() {
			var textValue = drishti.elmVar.elm.textContent;
			if (textValue.indexOf(this.expectedValue) !== -1) {
				return this.expectedValue;
			}else {
				return textValue;
			}
		},
		aligned: function() {
			var alignedValue = [];
			elmRefTop = drishti.elmVar.elmRef.offsetTop;
			elmTop = drishti.elmVar.elm.offsetTop;
			elmRefLeft = drishti.elmVar.elmRef.offsetLeft;
			elmLeft = drishti.elmVar.elm.offsetLeft;
			if (elmRefTop === elmTop) alignedValue.push('Top');
			if (elmRefLeft === elmLeft) 	alignedValue.push('Left');
			if ((elmRefTop+drishti.elmVar.elmRef.offsetHeight) === (elmTop+drishti.elmVar.elm.offsetHeight)) alignedValue.push('Bottom');
			if ((elmRefLeft+drishti.elmVar.elmRef.offsetWidth) === (elmLeft+drishti.elmVar.elm.offsetWidth)) alignedValue.push('Right');
			return alignedValue;
		},
		attribute: function() {
			var elmAttr = drishti.elmVar.elm.attributes[drishti.refObj];
			if (elmAttr !== undefined) {
				return elmAttr.value;
			}else {
				return null;
			}
		},
		cssContains: function() {
			return drishti.getComputedStyle(drishti.elmVar.elm,drishti.refObj);
		},
		click: function () {
			if (drishti.expectedValue) {
				drishti.elmVar.elm.click();
			}
			return null;
		},
		enterText: function () {
			drishti.elmVar.elm.value = '';
			return null;
		},
		child: function () {
			if (!drishti.setChildParentFlag) {
				parentElm = drishti.elmVar.elm;
				drishti.setChildParentFlag = true;
			};
			drishti.elmVar.elm = parentElm.querySelector(''+drishti.refObj+'');
			return null;
		},
		showInViewport: function() {
			if (this.expectedValue) {
				drishti.elmVar.elm.scrollIntoView();
			}
			return null;
		},
		inViewport: function () {
			var elementTop = drishti.elmVar.elm.getBoundingClientRect().top;
			var elementBottom = drishti.elmVar.elm.getBoundingClientRect().bottom;
			return elementTop >= 0 && elementBottom <= window.innerHeight;
		  // Partly visible is what you need? Go with this:
		  //return elementTop < window.innerHeight && elementBottom >= 0;
		},
		scroll: function() {
			return null;
		},
		pageDown: function() {
			//if (parentObj === 'windowActions')
			window.scrollBy(0, window.innerHeight);
			return null;
		},
		pageUp: function() {
			if (parentObj === 'windowActions') {
				window.scrollBy(0, -(window.innerHeight));
			}
			return null;
		}
	}
};

/* run drishti library when page load has finished */
if (window.jQuery) {
	$(document).ready(function() {
		drishti.run();
	}); //$(window).bind("load", function() { drishti.run(); });
}else {
	document.onload = drishti.run();
}
