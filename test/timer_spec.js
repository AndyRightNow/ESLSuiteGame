/*************************************************************************************

									Timer Test

*************************************************************************************/

"use strict";

//***************************************************************
//	Test Timer.start(), Timer.stop() and Timer.totalTime()
//***************************************************************
Timer.start();
// var tmp = 0;
setInterval(function() {
    showText(Timer.totalTime());
});
