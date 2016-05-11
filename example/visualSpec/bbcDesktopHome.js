var drishtiSpec =  {
	title:{ selector:'.module__title span',
		textIs : 'Welcome to BBC.com'
	},
	topMediaList: { selector : '.media-list',
		width : 1264, height: 347,
		childList:5,
		visible: true,
	},
	bigNews: { selector: '.media--primary',
		width: 616, // negative test to show the error in console and on screen.
		heightAs : {topMediaList:'100%'},
		leftOf : {topItem2 : 16}, // big news is left of topItem2 by 16 pixel.
		aligned:{topItem2:'Top'}
	},
	topItem2:{ selector: '.media-list__item--2 .media--overlay',
		above: { topItem4: 8},
	},
	topItem3:{ selector: '.media-list__item--3 .media--overlay',
		rightOf:{ topItem2: 16}
	},
	topItem4:{ selector: '.media-list__item--4 .media--overlay',
		widthAs: 	{ topItem3 : '100%'},
		heightAs: { topItem3 : '100%'},
		below: 		{ topItem2 : 8 },
		aligned: 	{ topItem5 : 'Bottom'}
	},
	topItem5:{ selector: '.media-list__item--5 .media--overlay',
		widthAs: { topItem3: '100%'},
		heightAs: { topItem3: '100%'}
	},
	news:{ selector:'.module__title__link.tag.tag--news',
		textContains : 'News',
	}
};
