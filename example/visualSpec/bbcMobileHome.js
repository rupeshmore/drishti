var drishtiSpec =  {
	topHeadlines: {
		selector : '.media-list',
		width : 1264,
		height: 347,
		childList:5,
		visible: true,
	},
	bigNews: {
		selector: '.media--primary',
		width: 616, // negative test to show the error in console and on screen.
		heightAs : {topHeadlines:'100%'}, //height same as the above element.
		leftOf : {topItem2 : 16}, // big news is left of topItem2 by 16 pixel.
	},
	topItem2:{
		selector: '.media-list__item--2 .media--overlay',
	},
	news:{
		selector:'.module__title__link.tag.tag--news',
		textContains : 'News',
	}
};
