let helpers = require('./query');

//console log log(something);
// let log = console.log;
//
// // Credits to {NML}
// let $ = function (foo) {
//        return document.getElementById(foo);
//    }
//
// let query = function (q) {
//    return document.querySelector(q);
// }
// let queryAll = function (selectors) {
//  return document.querySelectorAll(selectors);
// }

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
}



resume.addEventListener('click', resumeSpeaking);
function resumeSpeaking(e) {
  e.preventDefault;
  synth.resume();
}


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


inputForm.onsubmit = function(event) {
  event.preventDefault();

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
