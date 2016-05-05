/*
 * Drishti Visual Testing Library in javascript.
 *
 * In Yoga, 'Drishti' means directed focus of gaze, during meditation.
 *
 * This testing library is capable of doing visual testing, with focus on using browser as a standalone tool to execute tests.

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
	domElement: '',
	domReferenceElement: '',
	specSelectorName: '',
	cssSelector : '',
	isElmNull: false,
	setChildParentFlag : false,
	actualValue: '',
	expectedValue: '',
	expectedValueofRef: '',
	errorTable: [],
	notExecutedTable: [],
	init: function () {
		this.passes = 0;
		this.failures = 0;
		this.notExecuted = 0;
		this.duration = 0;
		this.assertsDone = 0;
		for (var i in this.errorTable) {
			console.log('Inside drishti Init');
			var elm = this.errorTable[i].CssSelector;
			document.querySelector(elm).style.outline = '';
			this.errorTable.splice(i, 1);
		}
	},
	assert: function(value1,value2) {
		this.assertsDone += 1;
		if (value1 !== value2) {
			return this.error();
		} else {
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
						this.cssSelector = obj[property]['selector'];
						drishti.domElement = document.querySelector(''+this.cssSelector+'');
						drishti.specSelectorName = property;
					}
					drishti.isElmNull = drishti.isAbsent(drishti.domElement); // handle null elements
					console.groupCollapsed(property); // console reporting
					this.conditionValue +=  property + ' : ';
					drishti.refObj = Object.keys(obj[property])[0];
					drishti.parentObj = property;
					if (drishti.refObj in this.mainObj) {
						// To Do
						// elm referenced with itself please provide valid reference. //if (true) {};
						drishti.domReferenceElement = document.querySelector(''+drishti.mainObj[drishti.refObj]['selector']+'');
					}
					// child object handler -- start
					if (drishti.parentObj === 'child') {
						var childObj = Object.keys(obj[property]);
						drishti.setChildParentFlag = false;
					};

					if (typeof childObj === 'object') {
						var childIndex = childObj.indexOf(property);
						if (childIndex > -1) {
							drishti.refObj = childObj[childIndex];
							if (!drishti.isElmNull) {
								(drishti.methods.child)(); // call child function with refObj updated
							}
						}
					}
					// child object handler -- end
					myMethods = drishti.methods[property];
					if (myMethods !== undefined && !drishti.isElmNull && drishti.parentObj !== 'child') {
						this.actualValue = myMethods();
					}
					drishti.iterate(obj[property]);
				} else if (property !== 'selector') {
						this.expectedValue = obj[property];
						var printValue = this.expectedValue; // Safari showing undefined character in the object
						drishti.conditionValue += property +' : '+ drishti.expectedValue;
						// check if the expected value is string and do the conversion.
						if (/(\d+)%$/.test(this.expectedValue)) {
							var percentageDivisor = 100 / parseInt(RegExp.$1);
    					this.expectedValue = this.expectedValueofRef/percentageDivisor;
    					printValue = JSON.stringify(printValue);
    				} else if (/^([\+\-])(\d+)/.test(this.expectedValue)) {
    					this.expectedValue = this.expectedValueofRef + parseInt(RegExp.$_);
    					printValue = JSON.stringify(printValue);
			    	};

			    	//if element is null call only absent method to check
			    	if (drishti.isElmNull && property !== 'absent') {
							this.actualValue = null;
							console.log('%c '+property+' : '+printValue+'			Element defined in visualSpec not present, no test executed','color:orange');
							this.notExec();
						} else {
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
							var assertStatus = drishti.assert(this.actualValue,this.expectedValue);
							//Console line Reporting
							if (assertStatus) {
								console.log('%c '+property+' : '+printValue+'','color:green;');
							} else {
								console.log('%c '+property+' : '+printValue+'			{Expected: '+drishti.expectedValue+ ', Actual: '+drishti.actualValue+'}','color:red;','');
							}
						}
				}
				drishti.conditionValue = '';
			}
		}
		console.groupEnd(); // console reporting
	},
	iterate2: function (obj) {
		var myMethods;
		var selectorFound = false;
		for(var key in obj){
	    // skip loop if the property is from prototype
	    if(!obj.hasOwnProperty(key)) continue;

	    if(typeof obj[key] !== 'object'){
				if (key === 'selector') {
					cssSelector = obj[key];
					drishti.domElement = document.querySelector(''+cssSelector+'');
					selectorFound = true;
					drishti.isElmNull = drishti.isAbsent(drishti.domElement); // handle null elements
					//continue;
				}

				this.conditionValue +=  key + ' : ';

				drishti.refObj = key;

				// create reference object to compare with
				if (drishti.refObj in drishtiSpec) {
					// To Do elm referenced with itself please provide valid reference. //if (true) {};
					drishti.domReferenceElement = document.querySelector(drishtiSpec[drishti.specSelectorName]['selector']);
				}

				this.expectedValue = obj[key];

				var printValue = this.expectedValue;

				myMethods = this.methods[key];
				if (myMethods !== undefined && !drishti.isElmNull) {
					this.actualValue = myMethods();
				}

	      console.log(key+" = "+obj[key]);
	    } else {
				//console.log('Key Only ###',key);
				console.groupCollapsed(key); // console reporting
				drishti.parentObj = key;

				if (!selectorFound) {
					drishti.specSelectorName = drishti.parentObj;
				}

				if (drishti.isElmNull && key !== 'absent') {
					this.actualValue = null;
					console.log('%c '+key+' : '+printValue+'			Element defined in visualSpec not present, no test executed','color:orange');
					this.notExec();
				} else {
					//if (parentObj === 'attribute') {refObj = property; property = parentObj};

				}

	      drishti.iterate2(obj[key]);
	    }
  	}
		console.groupEnd();
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
			this.domElement.style.outline = '#f00 solid 5px';
		}
		if (Array.isArray(this.actualValue)) {
			this.actualValue = JSON.stringify(this.actualValue);
		}
		this.errorTable.push({
			CssSelector:this.cssSelector,
			//"ElementName In SpecFile":this.specSelectorName,
			"Test Condition":this.conditionValue,
			Actual:this.actualValue,
			Expected:this.expectedValue
		});
		return false;
	},
	notExec: function() {
		this.notExecuted += 1;
		this.notExecutedTable.push({
			CssSelector:this.cssSelector,
			//"ElementName In SpecFile":this.specSelectorName,
			"Test Condition":this.conditionValue,
			Actual:this.actualValue,
			Expected:this.expectedValue
		});
		return null;
	},
	getComputedStyle: function(element, style) {
		var computedStyle = {};
		if (typeof element.currentStyle != "undefined") {
			computedStyle = element.currentStyle[style];
		} else {
			computedStyle = document.defaultView.getComputedStyle(element, null)[style];
		}
		return computedStyle;
	},
	isVisible: function(element) {
		if (element.offsetHeight > 0) {
			return true;
		} else {
			return false;
		}
	},
	isAbsent: function(element) {
		if (element === null) {
			return true;
		} else {
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
		//console.log('%cDrishti%c%c Visual Testing' ,'color:blue;font-size : 25px','background: url("./image/drishti-eye-blue-sm.png");padding-right:100px;font-size:20px; text-align: center',''); // Reporting
		console.log('%cDrishti%c Visual Testing' ,'color:blue;font-size : 25px',''); // Reporting
		console.groupCollapsed('Drishti testing suite result');
		this.iterate(drishtiSpec);
		console.groupEnd();

		var endTime = new Date();
		duration = (endTime - startTime);

		this.result();

		this.eventDispatch("drishti-finished");
	},
	eventDispatch:function(eventName){
		//var drishtiEvent = new CustomEvent("drishti-finished"); // Create the event
		// document.dispatchEvent(drishtiEvent); // Dispatch/Trigger/Fire the event
		// Dispatch/Trigger/Fire the event
		var drishtiEvent = document.dispatchEvent(new CustomEvent(eventName));
		document.removeEventListener(drishtiEvent, false);
	},
	result:function () {
		if (this.notExecuted < 1) {
			console.log('%cpasses: %c'+this.passes+' , %cfailures: %c'+this.failures+' %c, duration: %c'+duration+'ms',
			  'color:green;font-size:16px','color:green;font-style:italic;font-size:18px',
				'color:red;font-size:16px','color:red;font-style:italic;font-size:18px',
				'font-size:16px', 'font-style:italic;font-size:18px');
		} else {
			console.log('%cpasses: %c'+this.passes+' , %cfailures: %c'+this.failures+' , %cnot executed: %c'+this.notExecuted+' %c, duration: %c'+duration+'ms',
			  'color:green; font-size : 16px','color:green; font-style:italic; font-size : 18px',
				'color:red; font-size : 16px','color: red; font-style: italic;font-size : 18px',
				'color:orange; font-size : 16px','color: orange; font-style: italic;font-size : 18px','font-size : 16px',
				'font-style: italic;font-size : 18px');
		};
		if (this.failures > 0) {
			console.groupCollapsed('%cdrishti: Error Table','color:grey; font-size:10;');
			drishti.showError();
			console.groupEnd();
		}
	},
	methods: {
		above: function() {
			return drishti.domReferenceElement.offsetTop - (drishti.domElement.offsetTop + drishti.domElement.offsetHeight);
		},
		below: function() {
			return drishti.domElement.offsetTop - (drishti.domReferenceElement.offsetTop + drishti.domReferenceElement.offsetHeight);
		},
		leftOf: function() {
			return  drishti.domReferenceElement.offsetLeft - (drishti.domElement.offsetLeft + drishti.domElement.offsetWidth);
		},
		rightOf: function() {
			return drishti.domElement.offsetLeft - (drishti.domReferenceElement.offsetLeft + drishti.domReferenceElement.offsetWidth);
		},
		widthAs: function() {
	    	drishti.expectedValueofRef = drishti.domReferenceElement.offsetWidth;
			return drishti.domElement.offsetWidth;
		},
		heightAs: function() {
	    	drishti.expectedValueofRef = drishti.domReferenceElement.offsetHeight;
			return drishti.domElement.offsetHeight;
		},
		width: function() {
			return drishti.domElement.offsetWidth;
		},
		height: function() {
			return drishti.domElement.offsetHeight;
		},
		top: function() {
			return drishti.domElement.offsetTop - drishti.domReferenceElement.offsetTop;
		},
		right: function() {
			return (drishti.domReferenceElement.offsetLeft + drishti.domReferenceElement.offsetWidth) - (drishti.domElement.offsetLeft + drishti.domElement.offsetWidth);
		},
		bottom: function() {
			return (drishti.domReferenceElement.offsetTop + drishti.domReferenceElement.offsetHeight) - (drishti.domElement.offsetTop + drishti.domElement.offsetHeight);
		},
		left: function() {
			return drishti.domElement.offsetLeft - drishti.domReferenceElement.offsetLeft;
		},
		absent: function() {
			return drishti.isAbsent(drishti.domElement);
		},
		visible: function() {
			return drishti.isVisible(drishti.domElement);
		},
		childItems: function() {
			return drishti.domElement.querySelectorAll(''+drishti.refObj+'').length;
		},
		childList: function() {
			return drishti.domElement.querySelectorAll('li').length;
		},
		textIs: function() {
			return drishti.domElement.textContent;
		},
		textContains: function() {
			var textValue = drishti.domElement.textContent;
			if (textValue.indexOf(this.expectedValue) > -1) {
				return this.expectedValue;
			} else {
				return textValue;
			}
		},
		aligned: function() {
			var alignedValue = [];
			elmRefTop = drishti.domReferenceElement.offsetTop;
			elmTop = drishti.domElement.offsetTop;
			elmRefLeft = drishti.domReferenceElement.offsetLeft;
			elmLeft = drishti.domElement.offsetLeft;
			if (elmRefTop === elmTop) alignedValue.push('Top');
			if (elmRefLeft === elmLeft) alignedValue.push('Left');
			if ((elmRefTop+drishti.domReferenceElement.offsetHeight) === (elmTop+drishti.domElement.offsetHeight)) alignedValue.push('Bottom');
			if ((elmRefLeft+drishti.domReferenceElement.offsetWidth) === (elmLeft+drishti.domElement.offsetWidth)) alignedValue.push('Right');
			return alignedValue;
		},
		attribute: function() {
			var elmAttr = drishti.domElement.attributes[drishti.refObj];
			if (elmAttr !== undefined) {
				return elmAttr.value;
			} else {
				return null;
			}
		},
		cssContains: function() {
			return drishti.getComputedStyle(drishti.domElement,drishti.refObj);
		},
		click: function () {
			if (drishti.expectedValue) {
				drishti.domElement.click();
			}
			return null;
		},
		enterText: function () {
			//to do
			drishti.domElement.value = '';
			return null;
		},
		child: function () {
			console.log('Inside Child',drishti.domElement);
			if (!drishti.setChildParentFlag) {
				parentElm = drishti.domElement;
				drishti.setChildParentFlag = true;
			};
			drishti.domElement = parentElm.querySelector(''+drishti.refObj+'');
			console.log('Inside Child',drishti.domElement);
			return null;
		},
		showInViewport: function() {
			if (this.expectedValue) {
				drishti.domElement.scrollIntoView();
			}
			return null;
		},
		inViewport: function () {
			var elementTop = drishti.domElement.getBoundingClientRect().top;
			var elementBottom = drishti.domElement.getBoundingClientRect().bottom;
			return elementTop >= 0 && elementBottom <= window.innerHeight;
		  // Partly visible is what you need? Go with this:
		  //return elementTop < window.innerHeight && elementBottom >= 0;
		},
		scroll: function() {
			return null;
		},
		pageDown: function() {
			window.scrollBy(0, window.innerHeight);
			return null;
		},
		pageUp: function() {
				window.scrollBy(0, -(window.innerHeight));
			return null;
		}
	}
};
