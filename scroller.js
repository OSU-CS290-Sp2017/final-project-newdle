var nameScroller = document.querySelector('.names-scroller');
var timeScroller = document.querySelector('.header-scroller');
var cellScroller = document.querySelector('.cell-scroller');
 

cellScroller.addEventListener('scroll', function(ev)
{
	nameScroller.scrollTop = cellScroller.scrollTop;
	timeScroller.scrollLeft = cellScroller.scrollLeft;
});