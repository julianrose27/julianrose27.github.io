var dragInterval = 100;
var carrierFreq = 440;
var modIndex = 0;
var dragger;

var firstClick = 0;

// create the gain object
var gain = new Tone.Gain({
  gain: 0.5
}).toMaster();

// create the oscillator
const fmOsc = new Tone.FMOscillator({
  frequency: carrierFreq,
  type: "sine",
  modulationType: "triangle",
  harmonicity: 0.2,
  modulationIndex: 0
}).connect(gain);

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
  carrierFreq = carrierFreq*0.995;
  fmOsc.frequency.rampTo(carrierFreq, 0.4);
  freqSlider.value = carrierFreq;

  // oscillator modulation index
  modIndex = modIndex*0.99;
  fmOsc.modulationIndex.rampTo(modIndex, 0.4);
  modIndexSlider.value = modIndex;

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
    oscilloscope.connect(fmOsc);
  } else {
    fmOsc.stop();
    clearInterval(dragger);
  }
})

//------------------------------------------------------------------------------
// Oscillator Carrier Frequency Slider -----------------------------------------
//------------------------------------------------------------------------------
var freqSlider = new Nexus.Slider('#freqSlider',{
    'size': [120,20],
    'mode': 'relative',
    'min': 20,
    'max': 1000,
    'step': 0,
    'value': 440
})
// adjust the frequency of the carrier oscillator when the slider value is changed
freqSlider.on('change', function(v) {
  carrierFreq = v;
  fmOsc.frequency.rampTo(carrierFreq, 0.4);
})

//------------------------------------------------------------------------------
// Click Based Frequency Control -----------------------------------------------
//------------------------------------------------------------------------------
var freqBtn = new Nexus.Button('#freqBtn',{
  'mode': 'button'
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
    carrierFreq = carrierFreq*(1+(time/4500));
    fmOsc.frequency.rampTo(carrierFreq, 0.4);
    freqSlider.value = carrierFreq;
  }
})

//------------------------------------------------------------------------------
// Oscillator Modulation Index Control -----------------------------------------
//------------------------------------------------------------------------------
var modIndexSlider = new Nexus.Slider('#modIndexSlider',{
  'size': [120, 20],
  'mode': 'relative',
  'min': 0,
  'max': 10,
  'step': 0,
  'value': 0
})

modIndexSlider.on('change', function(v) {
  // console.log(v);
  modIndex = v;
  fmOsc.modulationIndex.rampTo(modIndex, 0.1);
})

//------------------------------------------------------------------------------
// Click Based Modulation Index Control ----------------------------------------
//------------------------------------------------------------------------------
var modIndexButton = new Nexus.Button('#modIndexButton',{
  'mode': 'button'
})

modIndexButton.on('change', function(v) {
  if (v) {
    // set the time for when the button is clicked
    firstClick = (new Date()).getTime();
  } else {
    // set the time for when the button is released and subtract it from the initial click time
    var secondClick = (new Date()).getTime();
    var time = secondClick-firstClick;
    // multiply the mod index by 1 + a fraction of the time that the button was held down
    modIndex = modIndex*(1+(time/3000));
    fmOsc.modulationIndex.rampTo(modIndex, 0.4);
    modIndexSlider.value = modIndex;
  }
})

//------------------------------------------------------------------------------
// Oscilloscope ----------------------------------------------------------------
//------------------------------------------------------------------------------
var oscilloscope = new Nexus.Oscilloscope('#oscilloscope', {
  'size': [300, 150]
})
