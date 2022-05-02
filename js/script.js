var dragInterval = 100;
var dragger;

var frequency = {
  'min': 20,
  'max': 1000,
  'step': 0,
  'value': 440
}

var modIndex = {
  'min': 0,
  'max': 20,
  'step': 0,
  'value': 0
}

var firstClick = 0;

var delayTime = 0.5;

// gain node
var gain = new Tone.Gain({
  gain: 0.5
}).toMaster();

// delay node
feedbackDelay = new Tone.FeedbackDelay({
  delayTime: delayTime,
  wet: 0.5,
  feedback: 0.7
}).connect(gain);

// create the oscillator
const fmOsc = new Tone.FMOscillator({
  frequency: frequency['value'],
  type: "sine",
  modulationType: "triangle",
  harmonicity: 0.2,
  modulationIndex: modIndex['value']
}).connect(feedbackDelay);

//------------------------------------------------------------------------------
// Volume Dial -----------------------------------------------------------------
//------------------------------------------------------------------------------
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
// Oscillator Carrier Frequency Slider -----------------------------------------
//------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------
// Click Based Frequency Control -----------------------------------------------
//------------------------------------------------------------------------------
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
    frequency['value'] = frequency['value']*(1+(time/4500));
    fmOsc.frequency.rampTo(frequency['value'], 0.4);
    freqSlider.value = frequency['value'];
  }
})

//------------------------------------------------------------------------------
// Oscillator Modulation Index Control -----------------------------------------
//------------------------------------------------------------------------------
var modIndexSlider = new Nexus.Slider('#modIndexSlider',{
  // 'size': [100, 350],
  'mode': 'relative',
  'min': modIndex['min'],
  'max': modIndex['max'],
  'step': modIndex['step'],
  'value': modIndex['value']
})

modIndexSlider.on('change', function(v) {
  // console.log(v);
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

//------------------------------------------------------------------------------
// Click Based Modulation Index Control ----------------------------------------
//------------------------------------------------------------------------------
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
      modIndex['value'] = modIndex['value']*(1+(time/3000));
      fmOsc.modulationIndex.rampTo(modIndex['value'], 0.4);
      modIndexNum.value = modIndex['value'];
      modIndexSlider.value = modIndex['value'];
    }
  }
})

//------------------------------------------------------------------------------
// Oscilloscope ----------------------------------------------------------------
//------------------------------------------------------------------------------
var oscilloscope = new Nexus.Oscilloscope('#oscilloscope', {
  size: [300, 150]
});
var spectrogram = new Nexus.Spectrogram('#spectrogram', {
  size: [300, 150]
});
oscilloscope.connect(Tone.Master);
spectrogram.connect(Tone.Master);
