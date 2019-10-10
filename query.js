//console log log(something);
let log = console.log;

// Credits to {NML}
let $ = function (foo) {
       return document.getElementById(foo);
   }

let query = function (q) {
   return document.querySelector(q);
}
let queryAll = function (selectors) {
 return document.querySelectorAll(selectors);
}

// getBoundingClientRect --> Return the size of an element and its position relative to the viewport:
function dimensions() {
  let rect = Obj.getBoundingClientRect();
  x = Obj.left;
  y = Obj.top;
  w = Obj.width;
  h = Obj.height;
}

// browser compatibility for requestAnimationFrame
let requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationframe;

// UA(UserAgent) Sniffer Device Detecter
var browserPrefix;
navigator.sayswho = (function(){
  var N = navigator.appName, ua = navigator.userAgent, tem;
  var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem = ua.match(/version\/([\.\d]+)/i))!= null) M[2] = tem[1];
  M = M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
  M = M[0];
  if(M == "Chrome") { browserPrefix = "webkit"; }
  if(M == "Firefox") { browserPrefix = "moz"; }
  if(M == "Safari") { browserPrefix = "webkit"; }
  if(M == "MSIE") { browserPrefix = "ms"; }
  log(browserPrefix);
})();
