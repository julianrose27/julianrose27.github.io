var dragInterval = 100;
var carrierFreq = 440;
var modIndex = 0;
var dragger;

const fmOsc = new Tone.FMOscillator({
  frequency: carrierFreq,
  type: "sine",
  modulationType: "triangle",
  harmonicity: 0.2,
  modulationIndex: 0
}).toDestination();

//------------------------------------------------------------------------------
// Frequency Drag Logic --------------------------------------------------------
//------------------------------------------------------------------------------
function drag() {
  console.log('hello');
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

// slider to change the modulation index of the fmOscillator
var modIndexSlider = new Nexus.Slider('#modIndexSlider',{
  'size': [120, 20],
  'mode': 'relative',
  'min': 0,
  'max': 10,
  'step': 0,
  'value': 0
})

modIndexSlider.on('change', function(v) {
  console.log(v);
  modIndex = v;
  fmOsc.modulationIndex.rampTo(modIndex, 0.1);
})
