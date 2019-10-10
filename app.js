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

// user-agent sniffer
var browserPrefix;
navigator.sayswho = (function(){
  var N = navigator.appName, ua = navigator.userAgent, tem;
  var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem = ua.match(/version\/([\.\d]+)/i))!= null) M[2] = tem[1];
  M = M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
  M = M[0];
  if(M == "Chrome")   { browserPrefix = "webkit"; }
  if(M == "Firefox")  { browserPrefix = "moz";    }
  if(M == "Safari")   { browserPrefix = "webkit"; }
  if(M == "MSIE")     { browserPrefix = "ms";     }
})();

let synth = window.speechSynthesis;


let inputForm = query('form');
let inputTxt = query('.txt');
let voiceSelect = query('select');

let pitch = query('#pitch');
let pitchValue = query('.pitchValue');
let rate = query('#rate');
let rateValue = query('.rate-value');
let stopSpeak = query('#stop')
let resumeSpeak = query('#resume');

let voices = [];
let defaultVoice = '<optiondata-lang="en-GB" data-name="Google UK English Male"></option>';

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });



  let selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    let option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
  // if(browserPrefix == 'webkit') {
  //   console.log(browserPrefix)
  // }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    let utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

stopSpeak.addEventListener('click', stopSpeakfx);
function stopSpeakfx(e) {
  e.preventDefault;
  synth.pause();
  alert('press resume to continue');
}



resume.addEventListener('click', resumeSpeaking);
function resumeSpeaking(e) {
  e.preventDefault;
  synth.resume();
}

// this functions takes care of reading files from the OS.. !FileReader cant read files from abs path
if( window.FileReader && window.speechSynthesis ) {
    const fileInput = document.getElementById("thisFile");

    fileInput.addEventListener("change", event => {
        const Reader = new FileReader();
        Reader.readAsText( fileInput.files[ 0 ] );
        Reader.onload = event => {
            const contents = Reader.result;
            const utterThis = new SpeechSynthesisUtterance( contents );
            speechSynthesis.speak( utterThis );
        }
    });
}


inputForm.onsubmit = function(e) {
  e.preventDefault();
  speak();
  inputTxt.blur();
}

pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
  speak();
}
