var dragInterval = 100;
var dragger;

// values for the frequency of the oscillator
var frequency = {
  'min': 20,
  'max': 1000,
  'step': 0,
  'value': 440
}

// values relating to the modulation index
var modIndex = {
  'min': 0,
  'max': 20,
  'step': 0,
  'value': 0
}

var delayTime = {
  'value': 0.5,
  'wet': 0.5,
  'feedback': 0.7,
  'min': 0,
  'max': 1,
  'step': 0
}

var autoPanner = {
  value: 1,
  min: 0.1,
  max: 10,
  step: 0
}

var firstClick = 0;

// gain node
var gain = new Tone.Gain({
  gain: 0.5
}).toMaster();

const limiter = new Tone.Limiter(-20).connect(gain);

// reverb node
const reverb = new Tone.Reverb({
  channelCount: 2,
  decay: 10,
  wet: 0.15,
  preDelay: 0.1
}).connect(limiter);

// delay node
const delay = new Tone.FeedbackDelay({
  delayTime: delayTime['value'],
  wet: delayTime['wet'],
  feedback: delayTime['feedback']
}).connect(reverb);

// autopanner
const panner = new Tone.Panner(1).connect(delay);
const pannerLFO  = new Tone.LFO({
  frequency: 5,
  min: -100,
  max: 100
}).start();
pannerLFO.connect(panner.pan);

// create the oscillator
const fmOsc = new Tone.FMOscillator({
  frequency: frequency['value'],
  type: "sine",
  modulationType: "triangle",
  harmonicity: 0.2,
  modulationIndex: modIndex['value']
}).connect(panner);

//------------------------------------------------------------------------------
// Volume Dial -----------------------------------------------------------------
//------------------------------------------------------------------------------
Nexus.colors.accent = "#353535";

var masterVolumeDial = new Nexus.Dial('#masterVolumeDial', {
  'interaction': 'radial',
  'mode': 'relative',
  'min': 0,
  'max': 1,
  'step': 0,
  'value': 0.5
});

masterVolumeDial.on('change', function(v) {
  gain.gain.rampTo(v, .1);
})

//------------------------------------------------------------------------------
// Frequency Drag Logic --------------------------------------------------------
//------------------------------------------------------------------------------
function drag() {
  // oscillator main frequency
  frequency['value'] = frequency['value']*0.995;
  fmOsc.frequency.rampTo(frequency['value'], 0.4);
  freqSlider.value = frequency['value'];

  // oscillator modulation index
  modIndex['value'] = modIndex['value']*0.99;
  fmOsc.modulationIndex.rampTo(modIndex['value'], 0.4);
  modIndexSlider.value = modIndex['value'];

  // delay time
  delayTime['value'] = delayTime['value']*0.99;
  delay.delayTime.rampTo(delayTime['value'], 0.1);
  delayTimeSlider.value = delayTime['value'];

  // autopanner LFO
  autoPanner['value'] = autoPanner['value']*0.99;
  pannerLFO.frequency.rampTo(autoPanner['value'], 0.1);
  pannerSlider.value = autoPanner['value'];

}

//------------------------------------------------------------------------------
// Play Button -----------------------------------------------------------------
//------------------------------------------------------------------------------
var playBtn = new Nexus.Button('#playBtn', {
  'mode': 'toggle'
})
// start and stop the oscillator
playBtn.on('change', function(v) {
  if (playBtn.state) {
    fmOsc.start();
    dragger = setInterval(drag, dragInterval);
  } else {
    fmOsc.stop();
    clearInterval(dragger);
  }
})

//------------------------------------------------------------------------------
// Oscillator Carrier Frequency ------------------------------------------------
//------------------------------------------------------------------------------
Nexus.colors.accent = "#50b755";
Nexus.colors.mediumLight = "#78bc7c";

var freqSlider = new Nexus.Slider('#freqSlider',{
    // 'size': [100, 350],
    'mode': 'relative',
    'min': frequency['min'],
    'max': frequency['max'],
    'step': frequency['step'],
    'value': frequency['value']
})
// adjust the frequency of the carrier oscillator when the slider value is changed
freqSlider.on('change', function(v) {
  frequency['value'] = v;
  fmOsc.frequency.rampTo(frequency['value'], 0.4);
  freqNum.value = frequency['value'], 0.4;
})

var freqNum = new Nexus.Number("#freqNum", {
  'size': [100, 40],
  'value': frequency['value'],
  'min': frequency['min'],
  'max': frequency['max'],
  'step': frequency['step'],
})

var freqBtn = new Nexus.Button('#freqBtn',{
  'mode': 'button',
  'size': [100, 100]
})

freqBtn.on('change', function(v) {
  if (v) {
    // set the time for when the button is clicked
    firstClick = (new Date()).getTime();
  } else {
    // set the time for when the button is released and subtract it from the initial click time
    var secondClick = (new Date()).getTime();
    var time = secondClick-firstClick;
    // multiply the carrier frequency by 1 + a fraction of the time that the button was held down
    frequency['value'] = frequency['value']*(1+(time/2500));
    fmOsc.frequency.rampTo(frequency['value'], 0.4);
    freqSlider.value = frequency['value'];
  }
})

//------------------------------------------------------------------------------
// Oscillator Modulation Index Control -----------------------------------------
//------------------------------------------------------------------------------
Nexus.colors.accent = "#d35454";
Nexus.colors.mediumLight = "#d38585";

var modIndexSlider = new Nexus.Slider('#modIndexSlider',{
  // 'size': [100, 350],
  'mode': 'relative',
  'min': modIndex['min'],
  'max': modIndex['max'],
  'step': modIndex['step'],
  'value': modIndex['value']
})

modIndexSlider.on('change', function(v) {
  modIndex['value'] = v;
  fmOsc.modulationIndex.rampTo(modIndex['value'], 0.1);
  modIndexNum.value = v;
})

var modIndexNum = new Nexus.Number("#modIndexNum", {
  'size': [100, 40],
  'min': modIndex['min'],
  'max': modIndex['max'],
  'step': modIndex['step'],
  'value': modIndex['value']
})

var modIndexButton = new Nexus.Button('#modIndexButton',{
  'mode': 'button',
  'size': [100, 100]
})

modIndexButton.on('change', function(v) {
  if (modIndex['value'] == 0) {
    modIndex['value'] = 1;
    fmOsc.modulationIndex.rampTo(modIndex['value'], 0.4);
    modIndexNum.value = modIndex['value'];
    modIndexSlider.value = modIndex['value'];

  } else {
    if (v) {
      // set the time for when the button is clicked
      firstClick = (new Date()).getTime();
    } else {
      // set the time for when the button is released and subtract it from the initial click time
      var secondClick = (new Date()).getTime();
      var time = secondClick-firstClick;
      // multiply the mod index by 1 + a fraction of the time that the button was held down
      modIndex['value'] = modIndex['value']*(1+(time/1000));
      fmOsc.modulationIndex.rampTo(modIndex['value'], 0.4);
      modIndexNum.value = modIndex['value'];
      modIndexSlider.value = modIndex['value'];
    }
  }
})

//------------------------------------------------------------------------------
// Delay Stuff -----------------------------------------------------------------
//------------------------------------------------------------------------------
Nexus.colors.accent = "#be34ed";
Nexus.colors.mediumLight = "#cd75ea";

var delayTimeSlider = new Nexus.Slider('#delayTimeSlider',{
  // 'size': [100, 350],
  'mode': 'relative',
  'min': delayTime['min'],
  'max': delayTime['max'],
  'step': delayTime['step'],
  'value': delayTime['value']
})

delayTimeSlider.on('change', function(v) {
  delayTime['value'] = v;
  delay.delayTime.rampTo(delayTime['value'], 0.1);
  delayTimeNum.value = delayTime['value'];
})

var delayTimeButton = new Nexus.Button('#delayTimeButton', {
  'mode': 'button',
  'size': [100, 100]
})

delayTimeButton.on('change', function(v) {
    delayTime['value'] = Math.random();
    delay.delayTime.rampTo(delayTime['value'], 1);
    delayTimeNum.value = delayTime['value'];
    delayTimeSlider.value = delayTime['value'];
})

var delayTimeNum = new Nexus.Number('#delayTimeNum', {
  'size': [100, 40],
  'min': delayTime['min'],
  'max': delayTime['max'],
  'step': delayTime['step'],
  'value': delayTime['value']
})

//------------------------------------------------------------------------------
// Autopanner ------------------------------------------------------------------
//------------------------------------------------------------------------------
Nexus.colors.accent = "#23cece";
Nexus.colors.mediumLight = "#8acece"

var pannerSlider = new Nexus.Slider('#pannerSlider', {
  'mode': 'relative',
  'min': autoPanner['min'],
  'max': autoPanner['max'],
  'step': autoPanner['step'],
  'value': autoPanner['value']
})

pannerSlider.on('change', function(v) {
  autoPanner['value'] = v;
  pannerLFO.frequency.rampTo(autoPanner['value'], 0.1);
  pannerNum.value = autoPanner['value'];
})

var pannerButton = new Nexus.Button('#pannerButton', {
  'mode': 'button',
  'size': [100, 100]
})

pannerButton.on('change', function(v) {
  if (v) {
    // set the time for when the button is clicked
    firstClick = (new Date()).getTime();
  } else {
    // set the time for when the button is released and subtract it from the initial click time
    var secondClick = (new Date()).getTime();
    var time = secondClick-firstClick;
    // multiply the carrier frequency by 1 + a fraction of the time that the button was held down
    autoPanner['value'] = autoPanner['value']*(1+(time/1500));
    pannerLFO.frequency.rampTo(autoPanner['value'], 0.1);
    pannerSlider.value = autoPanner['value'];
  }
})

var pannerNum = new Nexus.Number('#pannerNum', {
  'size': [100, 40],
  'min': autoPanner['min'],
  'max': autoPanner['max'],
  'step': autoPanner['step'],
  'value': autoPanner['value']
})

//------------------------------------------------------------------------------
// Oscillator Wave Selection ---------------------------------------------------
//------------------------------------------------------------------------------
var oscWaveSelect = new Nexus.Select('#oscWaveSelect', {
  'options': ['sine', 'square', 'triangle', 'sawtooth']
})

oscWaveSelect.on('change', function(v) {
  fmOsc.type = v.value;
})

//------------------------------------------------------------------------------
// Delay Mix -------------------------------------------------------------------
//------------------------------------------------------------------------------
var delayMixDial = new Nexus.Dial('#delayMixDial', {
  'min': 0,
  'max': 1,
  'value': delayTime['wet']
})

var delayMixNum = new Nexus.Number('#delayMixNum', {
  'min': 0,
  'max': 1,
  'value': delayTime['wet'],
  'step': 0
})

// update values when the dial is changed
delayMixDial.on('change', function(v) {
  delayTime['wet'] = v;
  delayMixNum.value = v;
  delay.wet.rampTo(delayTime['wet'], 0.4);
})
// color
delayMixDial.colorize('accent', "#be34ed");

//------------------------------------------------------------------------------
// Delay Feedback --------------------------------------------------------------
//------------------------------------------------------------------------------
var delayFeedbackDial = new Nexus.Dial('#delayFeedbackDial', {
  'min': 0,
  'max': 1,
  'step': 0,
  'value': delayTime['feedback']
})

var delayFeedbackNum = new Nexus.Number('#delayFeedbackNum', {
  'min': 0,
  'max': 1,
  'step': 0,
  'value': delayTime['feedback']
})

// update the values when the dial is changed
delayFeedbackDial.on('change', function(v) {
  delayTime['feedback'] = v;
  delayFeedbackNum.value = v;
  delay.feedback.rampTo(delayTime['feedback'], 0.4);
})
// color
delayFeedbackDial.colorize('accent', "#be34ed");

//------------------------------------------------------------------------------
// Pan Depth -------------------------------------------------------------------
//------------------------------------------------------------------------------
var panDepthDial = new Nexus.Dial('#panDepthDial', {
  'min': 0,
  'max': 100,
  'step': 1,
  'value': pannerLFO.max
})

var panDepthNum = new Nexus.Number('#panDepthNum', {
  'min': 0,
  'max': 100,
  'step': 1,
  'value': pannerLFO.max
})
// update values
panDepthDial.on('change', function(v) {
  pannerLFO.max = v;
  pannerLFO.min = v*-1;
  panDepthNum.value = v;
})
// color
panDepthDial.colorize('accent', '#23cece');

//------------------------------------------------------------------------------
// Advanced Options Toggle -----------------------------------------------------
//------------------------------------------------------------------------------
var advancedToggle = new Nexus.Toggle('#advancedToggle');

advancedToggle.colorize('accent', '#353535');

// have the advanced options hidden by default but the user can toggle them
advancedToggle.on('change', function(v) {
  var elements = document.getElementsByClassName('advanced');
  for (let i = 0; i < elements.length; i++) {
    if (v) {
      elements[i].style.visibility = 'visible';
    } else {
      elements[i].style.visibility = 'hidden';
    }
  }
})

//------------------------------------------------------------------------------
// Metering --------------------------------------------------------------------
//------------------------------------------------------------------------------
Nexus.colors.accent = "#1162db";

var oscilloscope = new Nexus.Oscilloscope('#oscilloscope', {
  size: [500, 150]
});
var spectrogram = new Nexus.Spectrogram('#spectrogram', {
  size: [500, 150]
});
var meter = new Nexus.Meter('#meter', {
  size: [91, 115.7]
});
oscilloscope.connect(Tone.Master);
spectrogram.connect(Tone.Master);
meter.connect(Tone.Master);
meter.colorize('accent', '#5fdb06');
